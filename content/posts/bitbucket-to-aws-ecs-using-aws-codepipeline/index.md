---
title: "Bitbucket to AWS ECS Using AWS CodePipeline"
date: "2025-05-05T14:31:27+06:00"
tags:
  - "AWS"
  - "Terraform"
  - "IAC"
  - "CICD"
  - "AWS ECS"
description: "Today, CI/CD is one of the most crucial components of modern software development. The DevOps culture — which almost every tech company is adopting — would be unimaginable without a CI/CD pipeline."
---

![Bitbucket to AWS ECS Using AWS CodePipeline](bitbucket-ecs-pipeline.jpeg "Bitbucket to AWS ECS Using AWS CodePipeline")
<center>
Image by <a href="https://pixabay.com/users/pierre9x6-10217214/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4643451">Pierre Blaché</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4643451">Pixabay</a>
</center>

<br>

Today, CI/CD is one of the most crucial components of modern software development. The DevOps culture — which almost every tech company is adopting — would be unimaginable without a CI/CD pipeline. It automates the execution of test suites, the building of the application, and finally its deployment to the infrastructure, enabling end users to access and use the application. Numerous tools and technologies are available to help automate CI/CD processes. In this article, we will create a CI/CD pipeline on AWS that deploys the application to AWS ECS whenever a feature branch is merged into the main branch in Bitbucket.

We will use Terraform to provision the infrastructure on AWS. Terraform, a tool developed by HashiCorp, enables Infrastructure as Code (IaC). It allows us to define and manage infrastructure resources across multiple cloud providers using code. The AWS resources we will create are as follows:

1. Amazon ECS Cluster
2. AWS CodePipeline
3. AWS CodeBuild
4. Amazon ECR Repository
5. Amazon S3 Bucket

We will start by creating a file named `main.tf` and add the following code to it. We have specified AWS as the required provider, configured S3 as the remote backend, and set up DynamoDB to handle Terraform state locking. The infrastructure will be deployed in the `eu-central-1` region. 

```hcl
 terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
    backend "s3" {
        bucket         = "terraform-deployments"
        key            = "demo-app/terraform.tfstate"
        region         = "us-east-1"
        dynamodb_table = "terraform-state"
        encrypt        = true
    }
}

provider "aws" {
    region = "us-east-1"
}
```

We will create a file named locals.tf to define reusable local values within the Terraform code. While Terraform variables could also serve this purpose, we will use locals for simplicity in this article. 

```hcl
locals {
    region                   = "eu-central-1"
    account                  = "123456789012"
    connection_id            = "90129012-9012-9012-9012-9012d8839012"
    project_name             = "demo-pipeline"
    bitbucket_connection_arn = "arn:aws:codestar-connections:${local.region}:${local.account}:connection/${local.connection_id}"
    bitbucket_repository_id  = "workspace/repository-name"
    branch_name              = "main"
    image_uri                = "${local.account}.dkr.ecr.${local.region}.amazonaws.com/${local.project_name}:latest"
    vpc_id                   = "vpc-0xxxx123465abcdef"
    subnets                  = ["subnet-1111a22222222eb99", "subnet-1111a22222222eb88"]
}
```
To keep this article simple, we intentionally avoid creating resources such as a VPC or Bitbucket connection, and instead rely on pre-existing ones. You can find many online guides explaining how to set up these resources. Please note that when creating a Bitbucket connection in AWS, you must manually authorize it through the AWS Console. 

We now need to create an S3 bucket that will serve as the artifact store for AWS CodePipeline. Create a file named `s3_bucket.tf` and add the following code to it. 

```hcl
resource "aws_s3_bucket" "artifact_store" {
  bucket        = "${local.project_name}-artifacts"
  force_destroy = true
}
```

When we push code to Bitbucket, the build step of the pipeline will create a Docker image and push it to a container repository. We will use Amazon Elastic Container Registry (ECR) to store these Docker images. The following Terraform code creates an ECR repository in AWS. Create a file named `ecr.tf` and add the code shown below. 

```hcl
resource "aws_ecr_repository" "app" {
  name                 = local.project_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
```

Next, we will create an AWS CodeBuild resource, which handles the build stage of the CodePipeline. This build stage will construct a Docker image and push it to the ECR repository we previously created. However, before setting up the CodeBuild resource, we must first define an IAM role with the necessary permissions.

```hcl
resource "aws_iam_role" "codebuild_role" {
  name = "${local.project_name}-build-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name = "${local.project_name}-build-role-policy"
  role = aws_iam_role.codebuild_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Resource = ["*"]
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
      },
      {
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.artifact_store.arn,
          "${aws_s3_bucket.artifact_store.arn}/*"
        ]
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketAcl",
          "s3:GetBucketLocation"
        ]
      }
    ]
  })
}
```

An IAM role with appropriate permissions for CloudWatch Logs, ECR, and S3 has been created. We'll now define the CodeBuild resource using the following configuration. 

```hcl
resource "aws_codebuild_project" "build" {
  name          = "${local.project_name}-build"
  description   = "Build and push Docker image"
  build_timeout = "10"
  service_role  = aws_iam_role.codebuild_role.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "ECR_REPOSITORY_URI"
      value = aws_ecr_repository.app.repository_url
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }
}
```

We will keep the IAM role permissions and CodeBuild-related Terraform code in the same file. Create a file named `code_build.tf` and add the previously defined role, policy, and CodeBuild configuration to it. 

When creating the CodeBuild project, we referenced a `buildspec.yml` file. Below is the content of that file, which authenticates to Amazon ECR, builds a Docker image, and pushes it to the ECR repository. Save this content to a file named `buildspec.yml`.

```yaml
version: 0.2

env:
  variables:
    AWS_DEFAULT_REGION: "eu-central-1"
    ECR_REPOSITORY_URI: "123456789012.dkr.ecr.eu-central-1.amazonaws.com"
    IMAGE_NAME: "demo-pipeline"
    IMAGE_TAG: 1.0

phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI
      - printenv > .env
  build:
    commands:
      - docker build -t $IMAGE_NAME --target worker --tag $ECR_REPOSITORY_URI:latest .
  post_build:
    commands:
      - docker tag $ECR_REPOSITORY_URI:latest $ECR_REPOSITORY_URI:$IMAGE_TAG
      - docker push $ECR_REPOSITORY_URI:latest
      - docker push $ECR_REPOSITORY_URI:$IMAGE_TAG
      - printf "[{\"name\":\"${IMAGE_NAME}\",\"imageUri\":\"${ECR_REPOSITORY_URI}:${IMAGE_TAG}\"}]" > imagedefinitions.json
artifacts:
  files:
    - imagedefinitions.json
  discard-paths: yes
```

Now we will create the main AWS CodePipeline. To do this, create a file named `code_pipeline.tf`. First, we’ll define an IAM role with the required permissions for the pipeline. Then, we'll configure the pipeline itself. 

The pipeline consists of three stages: 

1. Source Stage : Connects to Bitbucket and checks out the source code.
2. Build Stage : Triggers the CodeBuild project we created earlier.
3. Deploy Stage : Deploys the application to Amazon Elastic Container Service (ECS).

```hcl
resource "aws_iam_role" "codepipeline_role" {
  name = "${local.project_name}-pipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "${local.project_name}-pipeline-role-policy"
  role = aws_iam_role.codepipeline_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.artifact_store.arn,
          "${aws_s3_bucket.artifact_store.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codestar-connections:UseConnection"
        ]
        Resource = [local.bitbucket_connection_arn]
      },
      {
        "Effect": "Allow",
        "Action": [
          "codebuild:*",
          "codedeploy:*",
          "ecs:*"
        ],
        "Resource": [
            "*"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
            "iam:PassRole"
        ],
        "Resource": [
            aws_iam_role.task_definition_role.arn
        ]
      }
    ]
  })
}

resource "aws_codepipeline" "pipeline" {
  name     = local.project_name
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.artifact_store.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = local.bitbucket_connection_arn
        FullRepositoryId = local.bitbucket_repository_id
        BranchName       = local.branch_name
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "BuildAndPush"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.build.name
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "DeployAction"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ECS"
      version         = "1"
      input_artifacts = ["build_output"]

      configuration = {
        ClusterName = local.project_name
        ServiceName = local.project_name
      }
    }
  }
}
```

Now that the pipeline is configured, we'll proceed to create the necessary AWS ECS resources. Create a file named `ecs.tf` and add all the following code to it. 

First, we will define an ECS task definition. Task definitions serve as blueprints for tasks that run on Amazon Elastic Container Service (ECS). In the code below, we define both an IAM role with the required permissions and the task definition itself. 

```hcl
resource "aws_iam_role" "task_definition_role" {
  name = "${local.project_name}-task-definition-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "task_definition_policy" {
  name = "${local.project_name}-task-definition-role-policy"
  role = aws_iam_role.task_definition_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetAuthorizationToken",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue",
        "ssm:GetParameters"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}

resource "aws_ecs_task_definition" "martailer_api_worker" {
  family                   = local.project_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  container_definitions = <<DEFINITION
[
  {
    "name": "${local.project_name}",
    "image": "${aws_ecr_repository.app.repository_url}:latest",
    "essential": true,
    "portMappings": [
      {
        "containerPort": 5000,
        "hostPort": 5000
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.martailer_api_worker.name}",
        "awslogs-region": "${local.region}",
        "awslogs-stream-prefix": "${local.project_name}"
      }
    }
  }
]
DEFINITION
  execution_role_arn = aws_iam_role.task_definition_role.arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}
```

Next, we'll create a security group for the Amazon ECS service to control inbound and outbound network traffic for associated tasks.

```hcl
resource "aws_security_group" "martailer_api_worker" {
  name        = local.project_name
  description = "Allow inbound traffic to martailer worker"
  vpc_id      = local.vpc_id
  ingress {
    description      = "Allow HTTP from anywhere"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
   egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
```

Finally, we will create the Amazon ECS cluster and deploy the ECS service to complete the setup. 

```hcl
resource "aws_ecs_cluster" "martailer_api_worker" {
  name = local.project_name
}

resource "aws_ecs_service" "martailer_api_worker" {
  name            = local.project_name
  cluster         = aws_ecs_cluster.martailer_api_worker.id
  task_definition = aws_ecs_task_definition.martailer_api_worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = local.subnets
    security_groups = [aws_security_group.martailer_api_worker.id]
    assign_public_ip = true
  }
}
```

We will also create a CloudWatch Logs log group to capture and view logs generated by containers running in the ECS cluster. 

```hcl
resource "aws_cloudwatch_log_group" "martailer_api_worker" {
  name = "/ecs/${local.project_name}"
}
```

We now have all the necessary Terraform code for our infrastructure. The directory structure should look like the following:

```txt
|
|- buildspec.yml
|- code_build.tf
|- code_pipeline.tf
|- ecr.tf
|- ecs.tf
|- locals.tf
|- main.tf
|- s3_bucket.tf
```

Navigate to the project directory in your terminal and run the following commands. If the AWS CLI is configured correctly on your machine, Terraform will deploy the complete CI/CD pipeline and ECS cluster to your AWS account. 

```bash
terraform init
terraform plan
terraform apply
```

## Conclusion
DevOps practices have become increasingly common in the tech industry, with nearly every modern development team adopting its principles. A CI/CD pipeline plays a crucial role in enabling efficient DevOps workflows. In this article, we demonstrate how to build a CI/CD pipeline that automatically deploys an application to Amazon ECS whenever code is pushed to a branch in Bitbucket.

---
