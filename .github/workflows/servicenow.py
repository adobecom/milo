import requests
import time
import datetime
import timedelta
import json
import os

def sanitizeStr(text):
  """
    Sanitizes a target string to work in a JSON object.

    Args:
        text (str): The string to sanitize.

    Returns:
        string: sanitized string value.
    """

    text.replace('"','\"')
    text.replace("'","\'")
    text.replace("(","[")
    text.replace(")","]")
    text.replace("\\\\","//")
    text.replace("//","\/")
    text.replace("\\r","\r")
    text.replace("\\n","\n")
    text.replace("\\t","\t")

    return text

def find_string_in_json(json_data, target_string):
    """
    Finds a target string in a JSON object.

    Args:
        json_data (dict or list): The JSON data to search.
        target_string (str): The string to find.

    Returns:
        bool: True if the string is found, False otherwise.
    """

    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if isinstance(value, str) and target_string in value:
                return True
            elif isinstance(value, (dict, list)):
                if find_string_in_json(value, target_string):
                    return True
    elif isinstance(json_data, list):
        for item in json_data:
            if isinstance(item, str) and target_string in item:
                return True
            elif isinstance(item, (dict, list)):
                if find_string_in_json(item, target_string):
                    return True

    return False

# Execute Script logic:
# python servicenow.py
if __name__ == "__main__":

  print("Starting CMR Action...")

  print("Setting Planned Maintenance Time Windows for CMR...")
  start_time = (datetime.datetime.now() + datetime.timedelta(seconds = 10)).timestamp()
  end_time = (datetime.datetime.now() + datetime.timedelta(minutes = 10)).timestamp()

  print("Set Release Summary for CMR...")
  release_title = sanitizeStr(process.env.PR_TITLE)
  release_details = sanitizeStr(process.env.PR_BODY)
  release_summary = "Release_Details: ${release_details} Pull Request Number: ${process.env.PR_NUMBER} Pull Request Created At: ${process.env.PR_CREATED_AT} Pull Request Merged At: ${process.env.PR_MERGED_AT}"

  print("Getting IMS Token")
  ims_url = 'https://ims-na1-stg1.adobelogin.com/ims/token'
  headers = {"Content-Type":"multipart/form-data"}
  data = {
    'client_id': "${process.env.IMSACCESS_CLIENT_ID}",
    'client_secret': "${process.env.IMSACCESS_CLIENT_SECRET}",
    'grant_type': "authorization_code",
    'code': "${process.env.IMSACCESS_AUTH_CODE}"
  }
  response = requests.post(ims_url, data=data)
  jsonParse = json.loads(response.text)

  if response.status_code != 200:
    print("POST failed with response code: ${response.status_code}")
    exit 1
  elif find_string_in_json(jsonParse, "error")
    print("IMS token request failed with response: ${response.text}")
    exit 1
  else:
    print("IMS token request was successful")
    token = jsonParse["access_token"]

  print("Create CMR in ServiceNow...")

  servicenow_cmr_url = 'https://ipaasapi-stage.adobe-services.com/change_management/changes'
  headers = {
    "Accept":"application/json",
    "Authorization":"${token}",
    "Content-Type":"application/json",
    "api_key":"${process.env.IPAAS_KEY}"
  }
  data = {
    "title":"${release_title}",
    "description":"${release_summary}",
    "instanceIds": [ 537445 ],
    "plannedStartDate": start_time,
    "plannedEndDate": end_time,
    "coordinator": "narcis@adobe.com",
    "executor": "mauchley@adobe.com",
    "customerImpact": "No Impact",
    "changeReason": [ "New Features", "Bug Fixes", "Enhancement", "Maintenance", "Security" ],
    "preProductionTestingType": [ "End-to-End", "Functional", "Integrations", "QA", "Regression", "UAT", "Unit Test" ],
    "backoutPlanType": "Roll back",
    "approvedBy": [ "osahin@adobe.com" ],
    "testPlan": "Test plan is documented in the PR link in the Milo repository above. See the PR's merge checks to see Unit and Nala testing.",
    "implementationPlan": "The change will be released as part of the continuous deployment of Milo's production branch, i.e., \"main\"",
    "backoutPlan": "Revert merge to the Milo production branch by creating a revert commit.", "testResults": "Changes are tested and validated successfully in staging environment. Please see the link of the PR in the description for the test results and/or the \"#nala-test-results\" slack channel."
  }
  response = requests.post(servicenow_cmr_url, json=data)
  jsonParse = json.loads(response.text)

  if response.status_code != 200:
    print("POST failed with response code: ${response.status_code}")
    exit 1
  elif find_string_in_json(jsonParse, "error")
    print("CMR creation failed with response: ${response.text}")
    exit 1
  else:
    print("CMR creation was successful")
    transaction_id = jsonParse["id"]

  print("Waiting for Transaction from Queue to ServiceNow then Retrieve CMR ID...")

  servicenow_get_cmr_url = 'https://ipaasapi-stage.adobe-services.com/change_management/transactions/${transaction_id}'
  headers = {
    "Accept":"application/json",
    "Authorization":"${token}",
    "api_key":"${process.env.IPAAS_KEY}"
  }

  # Wait 10 seconds to provide time for the transaction to exit the queue and be saved into ServiceNow as a CMR record.
  time.sleep(10)
  response = requests.get(servicenow_get_cmr_url)
  jsonParse = json.loads(response.text)

  if response.status_code != 200:
    print("GET failed with response code: ${response.status_code}")
    exit 1
  elif find_string_in_json(jsonParse, "error")
    print("CMR ID retrieval failed with response: ${response.text}")
    exit 1
  else:
    print("CMR ID retrieval was successful")
    cmr_id = jsonParse["result.changeId"]

  print("Setting Actual Maintenance Time Windows for CMR...")
  actual_start_time = (datetime.datetime.now() - datetime.timedelta(seconds = 10)).timestamp()
  actual_end_time = datetime.datetime.now().timestamp()

  print("Closing CMR in ServiceNow...")

  headers = {
    "Accept":"application/json",
    "Authorization":"${token}",
    "Content-Type":"application/json",
    "api_key":"${process.env.IPAAS_KEY}"
  }
  data = {
    "id": "${transactionId}",
    "actualStartDate": actual_start_time,
    "actualEndDate": actual_end_time,
    "state": "Closed",
    "closeCode": "Successful",
    "notes": "The change request is closed as the change was released successfully"
  }
  response = requests.post(servicenow_cmr_url, json=data)
  jsonParse = json.loads(response.text)

  if response.status_code != 200:
    print("POST failed with response code: ${response.status_code}")
    exit 1
  elif find_string_in_json(jsonParse, "error")
    print("CMR closure failed with response: ${response.text}")
    exit 1
  else:
    print("CMR closure was successful")
