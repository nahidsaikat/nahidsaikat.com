---
title: "Stream Data to S3 Using `mongoexport` Tool"
date: "2025-03-25T12:40:06+06:00"
tags:
  - "MongoDB"
  - "AWS"
  - "S3"
description: ""
---

![Stream Data to S3 Using `mongoexport` Tool](mongoexport-tool.jpeg "Stream Data to S3 Using `mongoexport` Tool")
<center>
Image by <a href="https://pixabay.com/users/alexandra_koch-621802/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9487460">Alexandra_Koch</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9487460">Pixabay</a>
</center>

<br>

Recently at my work we had a requirement to push new data from MongoDB to S3. The data in the MongoDB are the stream of events, so there will be huge amount of data inserted in the DB everyday. We set a TTL on the database so that the old data aumatically gets deleted. And for the backup purpose we planned to push the data to S3.

The actual solution was quite handy. We run a cronjob on Kubernetes that will run a script periodically. The script gets some configurations from DynamoDB and run `mongoexport` tool to get new data and finally push those data to S3. 

For the Kubernetes structure we had created a CronJob resource that will trigger a container periodically and inside the container the script gets run. 

In this article I will be going through the script which is written in Python. I will be discussing the whole script step by step to make it easier to understand.

First, lets talk about the [mongoexport](https://www.mongodb.com/docs/database-tools/mongoexport/) tool that is executed from inside the script. `mongoexport` is a database tool that can produce export data in JSON or CSV format stored in a MongoDB instance. It is a command line tool that cannot be executed from mongo shell rather be executed in the terminal. The basic syntax of the command is,
```bash
mongoexport --collection=<coll> <options> <connection-string>
```
You must specify the collection to export and you have several other options to pass while running the command. For a full list of all the available options checkout the documentation.

We will begin by defining a function that contain the core functionality of exporting the data.
```python
def mongo_export_to_s3(username, password, host, port, db, collection, admindb, bucket, s3_key, query=None):
    pass
```
All the parameters are self explanatory. *username* and *password* are the credentials to connect to the MongoDB instance. *host* is where the DB is running in *port*. *db* is the database name and *collection* is where the data are stored. *admindb* is another database in the MongoDB instance where the user credentials are stored. The data will be exported to *bucket* at the *s3_key* file and we have an optional query parameter to filter out the data.

For our case we used the optional query parameter to filter the data by timestamp so that only new data gets exported to S3.

We will be biginning with building the actual `mongoexport` command that we will run on the system to get the data from MongoDB collection.
```python
cmd = [
    "mongoexport",
    "--uri", f"mongodb://{username}:{password}@{host}:{port}/",
    "--db", db,
    "--collection", collection,
    "--authenticationDatabase", admindb
]

# Add optional parameters
if query:
    cmd.extend(["--query", query])
```
We have constructed a list of individual options with its value with the actual command as the first item in the list.

As we are going to stream the data returned my the `mongoexport` command to S3, we need to use the multi part upload to S3 as there could be huge amount of data in the Mongo collection.
```python
s3_client = boto3.client('s3')
mpu = s3_client.create_multipart_upload(Bucket=bucket, Key=s3_key)
upload_id = mpu['UploadId']
```
In the above code we have created a S3 client and using that we have created a multi part upload instance and from that instance we get the *UploadId*. We will be using that *UploadId* everytime we upload a part to S3 as well as completing the multi part upload or aborting it in case there is an exception.

It this point, we will be starting the main process of uploading the stream of data into S3. We will be wraping it inside a try-catch statement. When an exception occurs we will abort the uploading process.

```python
try:
    ...
except Exception as e:
    print(f"Error: {e}")
    s3_client.abort_multipart_upload(Bucket=bucket, Key=s3_key, UploadId=upload_id)
    return False
```

We will be using Python's `subprocess` module to run the **mongoexport** command. The [subprocess](https://docs.python.org/3/library/subprocess.html) module allows you to spawn new processes to run external commands and connect to their input/output/rror pipes and obtain their return codes.

We will start the process using `subprocess.Popen` class which is responsible of creation and management of processes.
```python
process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
```
We have passed the main command **cmd** that we have defined earlier. We have used `subprocess.PIPE` for the *stdout* and *stderr* that will stream the output from the child process that we will grab and push to S3.

We need couple of variables to control the multipart upload process.
```python
chunk_size = 5 * 1024 * 1024
parts = []
part_number = 1
```
*chunk_size* is defined as **5MB** which is minimum size of part to upload to S3. We will maintain *parts* list that contains **ETag** and *part_number* and we will use that *parts* to mark the upload process as complete later. 

The following code is the main part of code to upload to S3.
```python
while True:
    chunk = process.stdout.read(chunk_size)
    if not chunk:
        break
        
    # Upload part
    part = s3_client.upload_part(
        Body=chunk,
        Bucket=bucket,
        Key=s3_key,
        PartNumber=part_number,
        UploadId=upload_id
    )
    
    parts.append({
        'PartNumber': part_number,
        'ETag': part['ETag']
    })
    
    part_number += 1
```
We have spinned up a *while* loop that will run untill there is no chunk of data from the child process. Inside the loop, we read data from child process's *stdout* and then we upload that data to S3 using **s3_client.upload_part** method.

We also put the part number and ETag into the parts list and finally we incremented the part_number counter.

When the loop finishes we read from the stderr of the child process to get any error if occurred. If there is any error we just abort the multipart upload.
```python
stderr = process.stderr.read()
if process.wait() != 0:
    print(f"Error in mongoexport: {stderr.decode('utf-8')}")
    s3_client.abort_multipart_upload(Bucket=bucket, Key=s3_key, UploadId=upload_id)
    return False
```

And finally, when all the parts are uploaded and there is no error found from the child process we will just mark the multipart upload as complete.
```python
s3_client.complete_multipart_upload(
    Bucket=bucket,
    Key=s3_key,
    MultipartUpload={'Parts': parts},
    UploadId=upload_id
)
```

The full version of the code is as follows,
```python
import subprocess
import boto3


def mongo_export_to_s3(username, password, host, port, db, collection, admindb, bucket, s3_key, query=None):
    # Build the mongoexport command
    cmd = [
        "mongoexport",
        "--uri", f"mongodb://{username}:{password}@{host}:{port}/",
        "--db", db,
        "--collection", collection,
        "--authenticationDatabase", admindb
    ]
    
    # Add optional query parameter
    if query:
        cmd.extend(["--query", query])
    
    # Create S3 multipart upload client
    s3_client = boto3.client('s3')
    mpu = s3_client.create_multipart_upload(Bucket=bucket, Key=s3_key)
    upload_id = mpu['UploadId']
    
    try:
        # Start the mongoexport child process
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Read and upload in chunks of 5MB (S3 minimum part size)
        chunk_size = 5 * 1024 * 1024
        parts = []
        part_number = 1
        
        while True:
            chunk = process.stdout.read(chunk_size)
            if not chunk:
                break
                
            # Upload part to S3
            part = s3_client.upload_part(
                Body=chunk,
                Bucket=bucket,
                Key=s3_key,
                PartNumber=part_number,
                UploadId=upload_id
            )
            
            parts.append({
                'PartNumber': part_number,
                'ETag': part['ETag']
            })
            
            part_number += 1
        
        # Check if the process completed successfully
        stderr = process.stderr.read()
        if process.wait() != 0:
            print(f"Error in mongoexport: {stderr.decode('utf-8')}")
            s3_client.abort_multipart_upload(Bucket=bucket, Key=s3_key, UploadId=upload_id)
            return False
        
        # Complete the multipart upload process
        s3_client.complete_multipart_upload(
            Bucket=bucket,
            Key=s3_key,
            MultipartUpload={'Parts': parts},
            UploadId=upload_id
        )
        
        print(f"Successfully uploaded to s3://{bucket}/{s3_key}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        s3_client.abort_multipart_upload(Bucket=bucket, Key=s3_key, UploadId=upload_id)
        return False


if __name__ == "__main__":
    mongo_export_to_s3(
        username="api",
        password="password",
        host="localhost",
        port=27017,
        db="streams",
        collection="events",
        admindb="admin",
        bucket="the-bucket",
        s3_key="events.json",
        query='{"timestamp": { "$gt": "2016-01-01T00:00:00Z" } }'
    )
```

### Conclusion


---
