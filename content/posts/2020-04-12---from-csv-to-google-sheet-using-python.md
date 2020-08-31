---
title: "From CSV to Google Sheet Using Python"
date: "2020-04-12T00:12:03.284Z"
template: "post"
draft: false
slug: "/blog/from-csv-to-google-sheet-using-python/"
category: "Python"
tags:
  - "Google"
  - "Spread Sheet"
description: "Upload a CSV file to Google Spread Sheet using python. In this article we have used a Python library gspread. gspread is a Python API for Google Sheets."
---

![From CSV to Google Sheet Using Python](/media/csv_to_google_sheet.jpg "From CSV to Google Sheet Using Python")

Recently I have written a Python script for my Manager. The purpose the  script was to read some JSON data, apply some business rules on them, generate a CSV(Comma Separated Value) file and upload it in a Google Spread Sheet. The sheet helped my manager to get insight of the JSON data so that he can take action based on it.

The JSON data and business rules of the script are very specific for my manager. But the way I managed to import the generated CSV file to Google Sheet is very generic. So what I have decided is that I will write an article on how I have uploaded the CSV file to Google Spread Sheet and this article is the result of it.

In that Python script I have used a library called [gspread](https://gspread.readthedocs.io/en/latest/ "gspread"). gspread is a Python API for Google Sheets. It's a very good Python library for interacting with Google Sheet as it is very simple and straight forward.

For interacting with Google Sheet API first thing we have to do is create a project in [Google Developers Console](https://console.developers.google.com/ , "Google Developers Console") and enable some APIs. To do that just follow the steps below.

1. Click on [this link](https://console.developers.google.com/cloud-resource-manager, "Google Developers Console") to create a project.

![Create Google Project](/media/google_sheet/0_create_project.jpg "Create Google Project")

2. Give the project a name.

![Create Google Project](/media/google_sheet/1_project_name.jpg "Create Google Project")

3. Go to project dashboard and click on <strong>  + ENABLE APIS AND SERVICES</strong>.

![Create Google Project](/media/google_sheet/2_enable_apis.jpg "Create Google Project")

4. Search for <strong>Google Drive API</strong> and click on it.

![Create Google Project](/media/google_sheet/3_search_drive_api.jpg "Create Google Project")

5. Enable Google Drive API.

![Create Google Project](/media/google_sheet/4_enable_drive_api.jpg "Create Google Project")

6. Click on <strong>Create Credentials</strong>.

![Create Google Project](/media/google_sheet/5_create_credentials.jpg "Create Google Project")

7. Select the parameters and click on <strong>What credentials do I need?</strong>.

![Create Google Project](/media/google_sheet/6_credential_type.jpg "Create Google Project")

8. Enter a Service Account Name and select Role.

![Create Google Project](/media/google_sheet/7_get_credential_json.jpg "Create Google Project")

A JSON file will be downloaded. We will need this JSON file in our script. So rename that file as ```client_secret.json```. The content of the JSON file is as following.
```json
{
  "type": "service_account",
  "project_id": "focus-zxzxzx-******",
  "private_key_id": "****************************************",
  "private_key": "-----BEGIN PRIVATE KEY-----\n***private_key***\n-----END PRIVATE KEY-----\n",
  "client_email": "google-sheet-demo@focus-zxzxzx-******.iam.gserviceaccount.com",
  "client_id": "************************",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/google-sheet-demo%40focus-zxzxzx-******.iam.gserviceaccount.com"
}
```
Now go to your Google Drive and create an Google Sheet and name it "CSV-to-Google-Sheet". Copy ```client_email``` value from the JSON file you have downloaded above and share that Google Sheet to this ```client_email``` with edit permission like the image below.

![Create Google Project](/media/google_sheet/8_share_sheet.jpg "Create Google Project")

At this point we have everything set up, so lets write our Python script to upload a CSV file in the Google Sheet. For this purpose we have to install gspread Python library. So open up the terminal and run the following commands.
```cmd
pip install gspread
pip install oauth2client
```

Now create a Python file and name it <strong>upload.py</strong>. Copy and paste the following code in it.
```python
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]

credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
client = gspread.authorize(credentials)

spreadsheet = client.open('CSV-to-Google-Sheet')

with open('data.csv', 'r') as file_obj:
    content = file_obj.read()
    client.import_csv(spreadsheet.id, data=content)
```

What we are doing here is import <strong>gspread</strong> and <strong>ServiceAccountCredentials</strong>, then we defined the scope and load the credentials from the JSON file we have download above. Then we are authorizing with the credentials and getting client object. We are using that client object to open the Google Sheet <strong>CSV-to-Google-Sheet</strong>. Finally we are reading the CSV file using <strong>open</strong> built-in function of Python and importing it to the Google Sheet by that client object. 

Now run the Python script with this command ```python upload.py``` and open <strong>CSV-to-Google-Sheet</strong> Google Sheet in your browser. You will see that your Google Sheet is updated with the content of the CSV file as following.

![Create Google Project](/media/google_sheet/9_after_upload.jpg "Create Google Project")

You can do more stuff with Google Sheet using gspread library. Checkout the [documentation](https://gspread.readthedocs.io/en/latest/ "gspread") to learn more.

The complete code of this article can be found in [this repository](https://github.com/nahidsaikat/CSV-to-Google-Sheet "GitHub").
