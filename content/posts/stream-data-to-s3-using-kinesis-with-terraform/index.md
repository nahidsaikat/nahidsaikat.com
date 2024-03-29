---
title: "Stream Data to S3 Using Kinesis and Firehose with Terraform"
date: "2022-11-27T00:12:03+06:00"
tags:
  - "AWS"
  - "S3"
  - "Kinesis"
  - "IAC"
  - "Terraform"
description: "AWS Kinesis is one of the best data stream service of its kind. In this article we will use it to stream data to S3."
---

![Stream Data to S3 Using Kinesis and Firehose with Terraform](kinesis-firehose.jpg "Stream Data to S3 Using Kinesis and Firehose with Terraform")
<center><span>Photo by <a href="https://unsplash.com/@isaac_taylor?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Isaac Mitchell</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
</center>
<br>

Real time data streaming is a hot topic nowadays. There are many scenario where real time data streaming is the key requirements. Like many other cool services AWS provides Amazon Kinesis service that lets us build solution to achieve real time data streaming. Amazon Kinesis has four products, i) Amazon Kinesis Video Streams, ii) Amazon Kinesis Data Streams, iii) Amazon Kinesis Data Firehose and iv) Amazon Kinesis Data Analytics. In this article we will use Amazon Kinesis Data Streams and Amazon Kinesis Data Firehose to develop a solution that can deliver streams of data to Amason S3. And we will be using Terraform to manage the infrastructure.

Let's get familiarize with the tool from their documentations.
### What is Amazon Kinesis Data Streams?
According to the [AWS Documentation](https://docs.aws.amazon.com/streams/latest/dev/introduction.html):

> You can use Amazon Kinesis Data Streams to collect and process large streams of data records in real time. You can create data-processing applications, known as Kinesis Data Streams applications. A typical Kinesis Data Streams application reads data from a data stream as data records. These applications can use the Kinesis Client Library, and they can run on Amazon EC2 instances. You can send the processed records to dashboards, use them to generate alerts, dynamically change pricing and advertising strategies, or send data to a variety of other AWS services. For information about Kinesis Data Streams features and pricing, see Amazon Kinesis Data Streams.


### What is Amazon Kinesis Data Firehose?
According to the [AWS Documentation](https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html):

> Amazon Kinesis Data Firehose is a fully managed service for delivering real-time streaming data to destinations such as Amazon Simple Storage Service (Amazon S3), Amazon Redshift, Amazon OpenSearch Service, Amazon OpenSearch Serverless, Splunk, and any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, Dynatrace, LogicMonitor, MongoDB, New Relic, and Sumo Logic. Kinesis Data Firehose is part of the Kinesis streaming data platform, along with Kinesis Data Streams, Kinesis Video Streams, and Amazon Kinesis Data Analytics. With Kinesis Data Firehose, you don't need to write applications or manage resources. You configure your data producers to send data to Kinesis Data Firehose, and it automatically delivers the data to the destination that you specified. You can also configure Kinesis Data Firehose to transform your data before delivering it.


### What is Amazon S3?
According to the [AWS Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html):

> Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance. Customers of all sizes and industries can use Amazon S3 to store and protect any amount of data for a range of use cases, such as data lakes, websites, mobile applications, backup and restore, archive, enterprise applications, IoT devices, and big data analytics. Amazon S3 provides management features so that you can optimize, organize, and configure access to your data to meet your specific business, organizational, and compliance requirements.


### What is Terraform?
According to the [Terraform Documentation](https://developer.hashicorp.com/terraform/intro):

> HashiCorp Terraform is an infrastructure as code tool that lets you define both cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share. You can then use a consistent workflow to provision and manage all of your infrastructure throughout its lifecycle. Terraform can manage low-level components like compute, storage, and networking resources, as well as high-level components like DNS entries and SaaS features.


As we are familiar with the tools that we will be using, its time to write some terraform code to have the infrastructure we want. First we will create an S3 bucket that will be the final destination of our data. Then we will create a Kinesis Data Scream, and finally we will create Kinesis Delivery Stream that will be pointing to that S3 bucket.

Creating S3 bucket,
```python
resource "aws_s3_bucket" "demo_bucket" {
  bucket = "${var.kinesis_stream_name}-data"

  tags = {
    Product = "Martailer"
  }
}

resource "aws_s3_bucket_acl" "demo_bucket_acl" {
  bucket = aws_s3_bucket.demo_bucket.id
  acl    = "private"
}
```

Creating Kinesis Data Stream,
```python
resource "aws_kinesis_stream" "demo_stream" {
  name             = "${var.kinesis_stream_name}"
  retention_period = 24

  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }

  tags = {
    Product = "Demo"
  }
}
```

Creating Kinesis Firehose Delivery Stream,
```python
resource "aws_kinesis_firehose_delivery_stream" "demo_delivery_stream" {
  name        = "${var.kinesis_stream_name}-delivery"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose.arn
    bucket_arn = aws_s3_bucket.demo_bucket.arn

    buffer_size = 5
    buffer_interval = 60

    cloudwatch_logging_options {
      enabled = "true"
      log_group_name = aws_cloudwatch_log_group.demo_firebose_log_group.name
      log_stream_name = aws_cloudwatch_log_stream.demo_firebose_log_stream.name
    }
  }

  kinesis_source_configuration {
    kinesis_stream_arn  = aws_kinesis_stream.demo_stream.arn
    role_arn            = aws_iam_role.firehose.arn
  }

  tags = {
    Product = "Demo"
  }
}
```

Creating CloudWatch Log Group,
```python
resource "aws_cloudwatch_log_group" "demo_firebose_log_group" {
  name = "/aws/kinesisfirehose/${var.kinesis_stream_name}-delivery"

  tags = {
    Product = "Demo"
  }
}

resource "aws_cloudwatch_log_stream" "demo_firebose_log_stream" {
  name           = "/aws/kinesisfirehose/${var.kinesis_stream_name}-stream"
  log_group_name = aws_cloudwatch_log_group.demo_firebose_log_group.name
}
```

Creating IAM Role and Policy,
```python
resource "aws_iam_role" "firehose" {
  name = "DemoFirehoseAssumeRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "firehose.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "firehose_s3" {
  name_prefix = var.iam_name_prefix
  policy      = <<-EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
            "s3:AbortMultipartUpload",
            "s3:GetBucketLocation",
            "s3:GetObject",
            "s3:ListBucket",
            "s3:ListBucketMultipartUploads",
            "s3:PutObject"
        ],
        "Resource": [
            "${aws_s3_bucket.demo_bucket.arn}",
            "${aws_s3_bucket.demo_bucket.arn}/*"
        ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "firehose_s3" {
  role       = aws_iam_role.firehose.name
  policy_arn = aws_iam_policy.firehose_s3.arn
}

resource "aws_iam_policy" "put_record" {
  name_prefix = var.iam_name_prefix
  policy      = <<-EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "firehose:PutRecord",
                "firehose:PutRecordBatch"
            ],
            "Resource": [
                "${aws_kinesis_firehose_delivery_stream.demo_delivery_stream.arn}"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "put_record" {
  role       = aws_iam_role.firehose.name
  policy_arn = aws_iam_policy.put_record.arn
}

resource "aws_iam_policy" "firehose_cloudwatch" {
  name_prefix = var.iam_name_prefix

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": [
            "${aws_cloudwatch_log_group.demo_firebose_log_group.arn}"
        ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "firehose_cloudwatch" {
  role       = aws_iam_role.firehose.name
  policy_arn = aws_iam_policy.firehose_cloudwatch.arn
}

resource "aws_iam_policy" "kinesis_firehose" {
  name_prefix = var.iam_name_prefix

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
            "kinesis:DescribeStream",
            "kinesis:GetShardIterator",
            "kinesis:GetRecords",
            "kinesis:ListShards"
        ],
        "Resource": "${aws_kinesis_stream.demo_stream.arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "kinesis_firehose" {
  role       = aws_iam_role.firehose.name
  policy_arn = aws_iam_policy.kinesis_firehose.arn
}
```

And finally the terraform variables,
```python
variable "kinesis_stream_name" {
  description = "Kinesis Data Stream Name"
  default     = "demo-event-log-stream"
}

variable "iam_name_prefix" {
  description = "Prefix used for all created IAM roles and policies"
  type        = string
  nullable    = false
  default     = "demo-kinesis-firehose-"
}
```

Now that we are finished writing the terraform code it's time to apply it to AWS. For this we need to configure the provider.
```python
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}
```

Now run the following commands to have the full infrastructure ready in AWS.
```python
>>> terraform init
>>> terraform plan
>>> terraform apply
```

The `init` command will initialize the terraform. `plan` command will list down everything that terraform is going to create and finally `apply` command will apply it. The `apply` command will ask your input for confirmation, just type `yes`.

Now that our infrastructure is ready its time to do some test. For that purpose we will write some Python code that product some mock data and put them to Kinesis data stream. After some time those mock data should be available to the S3 bucket.
```python
#!/usr/bin/env python3

import time
import random

import boto3

client = boto3.client("kinesis", region_name="eu-west-1")


STREAM_NAME = "MyFirstStream"


try:
    while True:
        time.sleep(1)
        data = bytes(str(random.randint(1, 100)).encode("utf-8"))
        print(f"Sending {data=}")
        response = client.put_record(StreamName=STREAM_NAME, Data=data, PartitionKey="A")
        # print(f"Received {response=}")
except KeyboardInterrupt:
    print("Finishing due to keyboard interrupt")
```

After running the python code data should be delivered to the S3 bucket. And it will maintain the folder structure that we specified in the `prefix`.
<br>

The complete code of this article can be found in [this repository](https://github.com/nahidsaikat/blog-post-code/tree/master/stream-data-to-s3-using-kinesis-and-firehose-with-terraform "GitHub").

### References
* [Delivering Real-time Streaming Data to Amazon S3 Using Amazon Kinesis Data Firehose](https://towardsdatascience.com/delivering-real-time-streaming-data-to-amazon-s3-using-amazon-kinesis-data-firehose-2cda5c4d1efe)
* [Stream Data with python and AWS Kinesis](https://blacksheephacks.pl/stream-data-with-python-and-aws-kinesis/)
