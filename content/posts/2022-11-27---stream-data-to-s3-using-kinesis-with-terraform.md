---
title: "Stream Data to S3 Using Kinesis and Firehose with Terraform"
date: "2022-11-27T00:12:03.284Z"
template: "post"
draft: true
slug: "/blog/stream-data-to-s3-using-kinesis-and-firehose-with-terraform/"
category: "AWS"
tags:
  - "AWS S3"
  - "AWS Kinesis"
  - "AWS Kinesis Firehose"
  - "Infrastructure as Code"
  - "Terraform"
description: "AWS Kinesis is one of the best data stream service of its kind. In this article we will use it to stream data to S3."
---

![Stream Data to S3 Using Kinesis and Firehose with Terraform](/media/unsplash/process-aws-dynamodb-streams-by-aws-lambda.jpg "Stream Data to S3 Using Kinesis and Firehose with Terraform")
<center><span>Photo by <a href="https://unsplash.com/@kaitduffey17?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Kaitlin Duffey</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
</center>
<br>

Real time data streaming is a hot topic nowadays. There are many scenario where real time data streaming is the key requirements. Like many other cool services AWS provides Amazon Kinesis service that lets us build solution to achieve real time data streaming. Amazon Kinesis has four products, i) Amazon Kinesis Video Streams, ii) Amazon Kinesis Data Streams, iii) Amazon Kinesis Data Firehose and iv) Amazon Kinesis Data Analytics. In this article we will use Amazon Kinesis Data Streams and Amazon Kinesis Data Firehose to develop a solution that can deliver stream of data to Amason S3. And we will be using Terraform to manage the infrastructure.

Let's get familiarize with the tool from their documentations.
### What is Amazon Kinesis Data Streams?
According to the [AWS Documentation](https://docs.aws.amazon.com/streams/latest/dev/introduction.html):
```
You can use Amazon Kinesis Data Streams to collect and process large streams of data records in real time. You can create data-processing applications, known as Kinesis Data Streams applications. A typical Kinesis Data Streams application reads data from a data stream as data records. These applications can use the Kinesis Client Library, and they can run on Amazon EC2 instances. You can send the processed records to dashboards, use them to generate alerts, dynamically change pricing and advertising strategies, or send data to a variety of other AWS services. For information about Kinesis Data Streams features and pricing, see Amazon Kinesis Data Streams.
```

The complete code of this article can be found in [this repository](https://github.com/nahidsaikat/blog-post-code/tree/master/process-aws-dynamodb-streams-by-aws-lambda-with-terraform "GitHub").
