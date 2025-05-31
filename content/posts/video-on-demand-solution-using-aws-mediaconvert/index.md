---
title: "Video on Demand Solution Using AWS MediaConvert"
date: "2025-05-20T16:11:49+06:00"
tags:
  - "AWS"
  - "Terraform"
  - "IAC"
  - "AWS MediaConvert"
description: ""
---

![Video on Demand Solution Using AWS MediaConvert](vod-solution-mediaconvert.jpeg "Video on Demand Solution Using AWS MediaConvert")
<center>
Image by <a href="https://pixabay.com/users/pierre9x6-10217214/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4643451">Pierre Blaché</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4643451">Pixabay</a>
</center>

<br>

AWS Elemental provides a number of services for video solutions. Whether it's a on demand video or live streaming, AWS Elemental covers both. AWS MediaConvert is one of such kind that transcodes video content for broadcasting and multi-screen delivery at scale. In this article, we will develop a Video on Demand (VOD) solution using AWS MediaConvert.

The solution that we will implement in this article is some thing like this, a video file will be uploaded in the AWS S3 that will trigger an AWS Lambda function. The Lambda function will create a MediaConvert job. We will catch the MediaConvert job complete event using AWS EventBridge that triggers another Lambda. And in that Lambda we can perform some operations like sending notifications.

We will begin by creating the S3 bucket. We will create separate bucket for the input and for the output. Input bucket is where the video file gets uploaded, and after finising the MediaConvert job the transcoded videos will be placed in the output bucket.

```hcl
resource "aws_s3_bucket" "input_bucket" {
  bucket        = "mediaconvert-input"
  force_destroy = true
}

resource "aws_s3_bucket" "output_bucket" {
  bucket        = "mediaconvert-output"
  force_destroy = true
}
```

The next step is to trigger a lambda after a video files is uploaded in the *input bucket*. This lambda will create the actual MediaConvert job. The terraform code of the lambda is as follows.

```hcl
data "archive_file" "python_lambda_package" {
  type        = "zip"
  source_dir  = "../lambdas/mediaconvert_job_trigger_lambda"
  output_path = "trigger_handler.zip"
}

resource "aws_lambda_function" "video_converter_lambda" {
  function_name    = "mediaconverter-trigger-lambda"
  filename         = "trigger_handler.zip"
  handler          = "handler.lambda_handler"
  runtime          = "python3.13"
  role             = aws_iam_role.lambda_execution_role.arn
  memory_size      = "128"
  timeout          = "10"
  source_code_hash = data.archive_file.python_lambda_package.output_base64sha256

  environment {
    variables = {
      DEFAULT_AWS_REGION     = var.region
      OUTPUT_BUCKET          = aws_s3_bucket.output_bucket.id
      ENV                    = var.env
      MEDIA_CONVERT_ROLE_ARN = "arn:aws:iam::${var.account_id}:role/service-role/MediaConvert_Default_Role"
    }
  }
}
```

We will have to create a lambda permission to allow execution from S3. We will create a bucket notification the triggers the lambda based on `s3:ObjectCreated` event. We can apply filter prefix to specify folder location in the S3 bucket and filter suffix to indicate the file type for which Lambda should be triggered.

```hcl
resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.video_converter_lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.input_bucket.bucket}"
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.input_bucket.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.video_converter_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "banners/"
    filter_suffix       = ".mp4"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}
```

The Lmabda on AWS is in place but we havn't written any Lambda code yet. In side the Lambda code, we will have the bucket name and object key in the event object. We will read the MediaConvert job settings from a json file and updated the input and output settings. And finally will create the MediaConvert job.

```python
#!/usr/bin/env python

import json
import os
import boto3


def lambda_handler(event, context):
    source_s3_bucket = event["Records"][0]["s3"]["bucket"]["name"]
    source_s3_key = event["Records"][0]["s3"]["object"]["key"]
    source_s3 = "s3://"+ source_s3_bucket + "/" + source_s3_key
    source_s3_base_name = os.path.splitext(os.path.basename(source_s3))[0]
    destination_s3 = "s3://" + os.environ["OUTPUT_BUCKET"] + "/output"
    media_convert_role = os.environ["MEDIA_CONVERT_ROLE_ARN"]
    region = os.environ["DEFAULT_AWS_REGION"]

    # Use MediaConvert SDK UserMetadata to tag jobs with the asset_id 
    # Events from MediaConvert will have the asset_id in UserMedata
    job_meta_data = {"env": os.environ["ENV"]}
    
    try:
        # Job settings are in the lambda zip file in the current working directory
        with open("job.json") as json_data:
            job_settings = json.load(json_data)

        # get the account-specific mediaconvert endpoint for this region
        mc_client = boto3.client("mediaconvert", region_name=region)
        endpoints = mc_client.describe_endpoints()

        # add the account-specific endpoint to the client session 
        client = boto3.client("mediaconvert", region_name=region, endpoint_url=endpoints["Endpoints"][0]["Url"], verify=False)

        job_settings["Inputs"][0]["FileInput"] = source_s3
        job_settings["OutputGroups"][0]["OutputGroupSettings"]["FileGroupSettings"]["Destination"] = destination_s3 + "/" + source_s3_base_name + "-high"
        job_settings["OutputGroups"][1]["OutputGroupSettings"]["FileGroupSettings"]["Destination"] = destination_s3 + "/" + source_s3_base_name + "-low"

        job = client.create_job(Role=media_convert_role, UserMetadata=job_meta_data, Settings=job_settings)

    except Exception as e:
        print ("Exception: %s" % e)
```

The file content of `job.json` can be found [here](https://github.com/nahidsaikat/blog-post-code/blob/master/video-on-demand-solution-using-aws-mediaconvert/lambdas/mediaconvert_job_trigger_lambda/job.json).

So far we have triggered the MediaConvert job from the Lambda function. When the job finishes we have to catch the `COMPLETE` event of that job. To do that we will create an EventBridge rule. This rule will trigger a Lambda when the job completes.

```hcl
data "aws_cloudwatch_event_bus" "default" {
  name = "default"
}

resource "aws_cloudwatch_event_rule" "job_completion" {
  name           = "mediaconvert-job-completion-rule"
  description    = "Rule to trigger when a MediaConvert job is completed"
  event_bus_name = data.aws_cloudwatch_event_bus.default.name


  event_pattern = <<EOF
      {
        "source": ["aws.mediaconvert"],
        "detail-type": ["MediaConvert Job State Change"],
        "detail": {
            "status": ["COMPLETE", "ERROR"],
            "userMetadata": {
                "env": [
                    "${var.env}"
                ]
            }
        }
      }
    EOF
}

resource "aws_cloudwatch_event_target" "target" {
  arn  = aws_lambda_function.mediaconvert_completion_lambda.arn
  rule = aws_cloudwatch_event_rule.job_completion.name
}
```

The last component of our solution is the second Lambda that will be triggered when MediaConvert job finishes. The terraform code for this Lambda is as follows.

```hcl
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "../lambdas/mediaconvert_job_completion_lambda"
  output_path = "completion_handler.zip"
}


resource "aws_lambda_function" "mediaconvert_completion_lambda" {
  function_name    = "mediaconverter-completion-lambda"
  filename         = "completion_handler.zip"
  handler          = "handler.lambda_handler"
  runtime          = "python3.13"
  role             = aws_iam_role.job_completion_lambda_role.arn
  memory_size      = "128"
  timeout          = "10"
  source_code_hash = data.archive_file.python_lambda_package.output_base64sha256

  environment {
    variables = {
      DEFAULT_AWS_REGION = var.region
      OUTPUT_BUCKET      = aws_s3_bucket.output_bucket.id
      ENV                = var.env
    }
  }
}

resource "aws_lambda_permission" "eventbridge" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mediaconvert_completion_lambda.function_name
  source_arn    = aws_cloudwatch_event_rule.job_completion.arn
  principal     = "events.amazonaws.com"
}
```

And the Lambda code in Python is as follow,

```python
#!/usr/bin/env python

def lambda_handler(event, context):
    result = 'Success'

    # Send email or notification

    return {
        'statusCode' : 200,
        'body': result
    }

```

Till now we have all the infrastructure code we needed for this solution. Navigate to the project directory in your terminal and run the following commands. If the AWS CLI is configured correctly on your machine, Terraform will deploy the complete infrastructure in your AWS account. 

```bash
terraform init
terraform plan
terraform apply
```

## Conclusion

On demand video solution is a common requirements now a days. Even after a live event there is a need to deliver this event content on demand to the user. There is a challenge though, users across the globe will have different network speed. Not only that, different device supports different video format. AWS MediaConvert bought us the solution to this challenge. In this article, we developed a solution that takes a video file and encodes it using MediaConvert to produce two different quality video.

---
The complete code of this article can be found in [this repository](https://github.com/nahidsaikat/blog-post-code/tree/master/video-on-demand-solution-using-aws-mediaconvert).

---

##### References
1. [Use AWS MediaConvert to reduce your videos size](https://antoine-75597.medium.com/use-aws-mediaconvert-to-reduce-your-videos-size-648871948e34)
2. [VOD automation part 1: Create a serverless watchfolder workflow using AWS Elemental MediaConvert](https://aws.amazon.com/blogs/media/vod-automation-part-1-create-a-serverless-watchfolder-workflow-using-aws-elemental-mediaconvert/)
3. [Video on Demand on AWS](https://aws.amazon.com/solutions/implementations/video-on-demand-on-aws/)
4. [aws-media-services-simple-vod-workflow](https://github.com/aws-samples/aws-media-services-simple-vod-workflow/tree/master/7-MediaConvertJobLambda)
5. [Terraform: AWS Eventbridge Rule](https://medium.com/@nagarjun_nagesh/terraform-aws-eventbridge-rule-21ba1fc1d93e)
6. [Terraform with AWS EventBridge [Step-by-Step Guide]](https://spacelift.io/blog/terraform-eventbridge#what-is-aws-eventbridge)
7. [Invoke specified CloudWatch Rule on MediaConvert Event](https://repost.aws/questions/QU0fy8p0ffSFmErUy4FJQRXA/invoke-specified-cloudwatch-rule-on-mediaconvert-event)
