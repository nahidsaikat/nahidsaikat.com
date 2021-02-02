---
title: "Process AWS DynamoDB Streams by AWS Lambda with Terraform"
date: "2021-02-02T00:12:03.284Z"
template: "post"
draft: false
slug: "/blog/process-aws-dynamodb-streams-by-aws-lambda-with-terraform/"
category: "AWS"
tags:
  - "AWS Lambda"
  - "AWS DynamoDB"
  - "Serverless"
  - "Infrastructure as Code"
  - "Terraform"
description: "This article discusses how we can tregger a AWS Lambda function from DynamoDB tables using DynamoDB Streams."
---

![Process AWS DynamoDB Streams by AWS Lambda with Terraform](/media/unsplash/process-aws-dynamodb-streams-by-aws-lambda.jpg "Process AWS DynamoDB Streams by AWS Lambda with Terraform")
<center><span>Photo by <a href="https://unsplash.com/@kaitduffey17?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Kaitlin Duffey</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
</center>
<br>

[AWS DynamoDB](https://aws.amazon.com/dynamodb/ "AWS DynamoDB") is a `key-vlaue` based NoSQL Database as a service(DBaaS) provided by Amazon Web Services. It offers a fully managed multi region database with build-in security, backup and restore facilities. It also has in-memory caching for internet-scale applications.

On the other hands, [AWS Lambda](https://aws.amazon.com/lambda/ "AWS Lambda") is a serverless compute service offered by Amazon Web Services. AWS Lambda allow you to run code without provisioning or managing servers so that you can focus only on code.

Both of the services are very useful and they solve lots of problems we face in our daily software development process. In this article we will discuss how we can use both of the services together using DynamoDB streams.

DynamoDB streams is a feature that allows us to capture the events in DynamoDB tables. DynamoDB Streams stores "creates", "updates" and "deletes" events from a DynamoDB tables when enabled. It maintains ordered flow of information and ensures that each stream record appears exactly once in the stream. We can set an AWS Lambda to get triggered when an item appears in the stream and process the data.

For that purpose let's create a DynamoDB table using terraform.

```
resource "aws_dynamodb_table" "dynamodb_table" {
  name             = "lambda-dynamodb-stream"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "Id"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "Id"
    type = "S"
  }
}
```
One thing to notice here is that we are setting `stream_enabled  = true` which will enable the stream in the table. By default the stream is not enabled so we needs to enable it by ourself.

Next we will create a lambda function. The terraform code that will create a lambda function is as follow.
```
resource "aws_lambda_function" "lambda_function" {
  function_name    = "process-dynamodb-records"
  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256
  handler          = "handler.handler"
  role             = aws_iam_role.lambda_assume_role.arn
  runtime          = "python3.8"

  lifecycle {
    create_before_destroy = true
  }
}

data "archive_file" "lambda_zip_file" {
  output_path = "${path.module}/lambda_zip/lambda.zip"
  source_dir  = "${path.module}/../lambda"
  excludes    = ["__init__.py", "*.pyc"]
  type        = "zip"
}
```

As we have the DynamoDB table and Lambda function created on our hand, now we needs to create an event source mapping so that this lambda gets triggered when DynamoDB stream has data in it.
```
resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn  = aws_dynamodb_table.dynamodb_table.stream_arn
  function_name     = aws_lambda_function.lambda_function.arn
  starting_position = "LATEST"
}
```

The lambda also requires an `IAM` role so that it can reads the stream data.
```
resource "aws_iam_role" "lambda_assume_role" {
  name               = "lambda-dynamodb-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": "LambdaAssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "dynamodb_read_log_policy" {
  name   = "lambda-dynamodb-log-policy"
  role   = aws_iam_role.lambda_assume_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Action": [ "logs:*" ],
        "Effect": "Allow",
        "Resource": [ "arn:aws:logs:*:*:*" ]
    },
    {
        "Action": [ "dynamodb:BatchGetItem",
                    "dynamodb:GetItem",
                    "dynamodb:GetRecords",
                    "dynamodb:Scan", We will have the recores inside of the lambda function in event `object`. We can also configure the stream to capture additional data such as "before" and "after" images of modified items.
                    "dynamodb:Query",
                    "dynamodb:GetShardIterator",
                    "dynamodb:DescribeStream",
                    "dynamodb:ListStreams" ],
        "Effect": "Allow",
        "Resource": [
          "${aws_dynamodb_table.dynamodb_table.arn}",
          "${aws_dynamodb_table.dynamodb_table.arn}/*"
        ]
    }
  ]
}
EOF
}
```

And the final thing that we will require is the handler of the lambda function.
```python
import logging

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)


def handler(event, context):
    for record in event['Records']:
        LOGGER.info(record['eventID'])
        LOGGER.info(record['eventName'])
        LOGGER.info(record['dynamodb'])
    return event
```
We will have the records inside of the lambda function in `event` object. We can also configure the stream to capture additional data such as "before" and "after" images of modified items.

When everything is set up, run the following commands in your terminal to deploy the infrastructure in AWS. Make sure that you have `default` AWS profile is already set.
```
terraform init
terraform plan
terraform apply
```


The complete code of this article can be found in [this repository](https://github.com/nahidsaikat/blog-post-code/tree/master/process-aws-dynamodb-streams-by-aws-lambda-with-terraform "GitHub").
