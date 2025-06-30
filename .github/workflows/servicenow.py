import datetime
import json
import os
import random
import sys
import time
import requests

APPLICATION_JSON = "application/json"
CMR_RETRIEVAL_ERROR = "CMR ID Retrieval Operation failed..."
POST_FAILURE_MESSAGE = "POST failed with response code: "
IMS_URL = 'https://ims-na1.adobelogin.com/ims/token'
SERVICENOW_CMR_URL = 'https://ipaasapi.adobe-services.com/change_management/changes'
SERVICENOW_GET_CMR_URL = 'https://ipaasapi.adobe-services.com/change_management/transactions/'

output_file = open(os.environ['GITHUB_OUTPUT'], 'a')

def _search_value(value, target_string):
  if isinstance(value, str):
    return target_string in value
  if isinstance(value, (dict, list)):
    return find_string_in_json(value, target_string)
  return False

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
    return any(_search_value(value, target_string) for value in json_data.values())
  if isinstance(json_data, list):
    return any(_search_value(item, target_string) for item in json_data)
  return False

def backoff_with_timeout(operation, max_retries=5, base_delay=1, max_delay=60, timeout=300):
  """
  Smart back off for operations that may require multiple attempts with increasing intervals between each
  execution until a successful return. Allows max attempts and/or timeout to ensure infinite looping doesn't
  happen.

  Args:
      operation (_type_): The operation you would like to attempt in intervals.
      max_retries (int, optional): The max amount of attempts allowed for the smart backoff. Defaults to 5.
      base_delay (int, optional): The starting delay for the random amount to calculate intervals. Defaults to 1.
      max_delay (int, optional): The maximum delay for the random amount to calculate intervals. Defaults to 60.
      timeout (int, optional): The max amount of time allowed for the smart backoff. Defaults to 300.

  Raises:
      TimeoutError: If the max amount of attempts or timeout is reached before a successful operation return happens, a timeout exception is thrown.

  Returns:
      _type_: The return value from the sent in operation that requires a smart backoff.
  """

  start_time = time.time()
  attempts = 0
  while attempts <= max_retries and (time.time() - start_time) < timeout:
    try:
      print("Attempting ServiceNow API operation...")
      return operation()  # Attempt the operation
    except Exception as e:
      attempts += 1
      if attempts > max_retries or (time.time() - start_time) >= timeout:
        raise  # Re-raise the exception if max retries or timeout is reached

      delay = min(base_delay * (2 ** (attempts - 1)), max_delay) + random.uniform(0, 0.1 * base_delay)
      time.sleep(delay)
  raise TimeoutError("Operation timed out after {} seconds or {} retries, whatever came first.".format(timeout, max_retries))

def get_cmr_id_operation():
  """
  Operation to retrieve a Change Management Request ID from ServiceNow

  Raises:
      Exception: If the GET request returns a non 200 response.
      Exception: If the GET request is successful but returns a error message payload.
      Exception: If the GET request is successful but returns an "Unknown" status message in payload.

  Returns:
      _type_: The Change ID from the JSON payload
  """
  response = requests.get(servicenow_get_cmr_url, headers=headers)
  JSON_PARSE = json.loads(response.text)

  if response.status_code != 200:
    print(f"GET failed with response code: {response.status_code}")
    print(response.text)
    raise Exception(CMR_RETRIEVAL_ERROR)
  elif find_string_in_json(JSON_PARSE, "error"):
    print(f"CMR ID retrieval failed with response code: {response.status_code}")
    print(response.text)
    raise Exception(CMR_RETRIEVAL_ERROR)
  else:
    if find_string_in_json(JSON_PARSE, "Unknown"):
      print(f"CMR ID retrieval failed with response code: {response.status_code}")
      print(response.text)
      raise Exception(CMR_RETRIEVAL_ERROR)

    print(f"CMR ID retrieval was successful: {response.status_code}")
    print(response.text)

  return JSON_PARSE["result"]["changeId"]

# Execute Script logic:
# python3 servicenow.py
if __name__ == "__main__":
  if os.environ['PR_STATE'] == 'open':
    print("Starting CMR Action...")

    print("Setting Planned Maintenance Time Windows for CMR...")
    start_time = int((datetime.datetime.now() + datetime.timedelta(seconds = 10)).timestamp())
    end_time = int((datetime.datetime.now() + datetime.timedelta(minutes = 10)).timestamp())

    print(f"Set start time for CMR: {start_time}")
    print(f"Set end time for CMR: {end_time}")

    print("Set Release Summary for CMR...")
    release_title = os.environ['PR_TITLE']
    release_details = os.environ['PR_BODY']
    pr_num = os.environ['PR_NUMBER']
    pr_link = os.environ['PR_LINK']
    pr_created = os.environ['PR_CREATED_AT']
    release_summary = f"Release_Details: {release_details} \n\nPull Request Number: {pr_num} \nPull Request Link: {pr_link} \nPull Request Created At: {pr_created} \nSee the closure notes for merge date."

    print("Getting IMS Token")
    headers = {"Content-Type":"multipart/form-data"}
    data = {
      'client_id': os.environ['IMSACCESS_CLIENT_ID'],
      'client_secret': os.environ['IMSACCESS_CLIENT_SECRET'],
      'grant_type': "authorization_code",
      'code': os.environ['IMSACCESS_AUTH_CODE']
    }
    response = requests.post(IMS_URL, data=data)
    json_parse = json.loads(response.text)

    if response.status_code != 200:
      print(f"{POST_FAILURE_MESSAGE} {response.status_code}")
      print(response.text)
      sys.exit(1)
    elif find_string_in_json(json_parse, "error"):
      print(f"IMS token request failed with response code: {response.status_code}")
      print(response.text)
      sys.exit(1)
    else:
      print(f"IMS token request was successful: {response.status_code}")
      token = json_parse["access_token"]

    print("Create CMR in ServiceNow...")

    headers = {
      "Accept": APPLICATION_JSON,
      "Authorization":token,
      "Content-Type": APPLICATION_JSON,
      "api_key":os.environ['IPAAS_KEY']
    }
    data = {
      "title":release_title,
      "description":release_summary,
      "instanceIds": [ os.environ['SNOW_INSTANCE_ID'] ],
      "plannedStartDate": start_time,
      "plannedEndDate": end_time,
      "coordinator": "narcis@adobe.com",
      "customerImpact": "No Impact",
      "changeReason": [ "New Features", "Bug Fixes", "Enhancement", "Maintenance", "Security" ],
      "preProductionTestingType": [ "End-to-End", "Functional", "Integrations", "QA", "Regression", "UAT", "Unit Test" ],
      "backoutPlanType": "Roll back",
      "approvedBy": [  "casalino@adobe.com", "jmichnow@adobe.com", "mauchley@adobe.com", "bbalakrishna@adobe.com", "tuscany@adobe.com", "brahmbha@adobe.com" ],
      "testPlan": "Test plan is documented in the PR link in the Milo repository above. See the PR's merge checks to see Unit and Nala testing.",
      "implementationPlan": "The change will be released as part of the continuous deployment of Milo's production branch, i.e., \"main\"",
      "backoutPlan": "Revert merge to the Milo production branch by creating a revert commit.", "testResults": "Changes are tested and validated successfully in staging environment. Please see the link of the PR in the description for the test results and/or the \"#nala-test-results\" slack channel."
    }
    response = requests.post(SERVICENOW_CMR_URL, headers=headers, json=data)
    json_parse = json.loads(response.text)

    if response.status_code != 200:
      print(f"{POST_FAILURE_MESSAGE} {response.status_code}")
      print(response.text)
      sys.exit(1)
    elif find_string_in_json(json_parse, "error"):
      print(f"CMR creation failed with response code: {response.status_code}")
      print(response.text)
      sys.exit(1)
    else:
      print(f"CMR creation was successful: {response.status_code}")
      print(response.text)
      transaction_id = json_parse["id"]
      output_file.write(f"transaction_id={transaction_id}\n")
      output_file.write(f"planned_start_time={datetime.datetime.fromtimestamp(start_time)}\n")
      output_file.write(f"planned_end_time={datetime.datetime.fromtimestamp(end_time)}\n")
      output_file.close()
  else:
    print("Waiting for Transaction from Queue to ServiceNow then Retrieve CMR ID...")

    print("Getting IMS Token")
    headers = {"Content-Type":"multipart/form-data"}
    data = {
      'client_id': os.environ['IMSACCESS_CLIENT_ID'],
      'client_secret': os.environ['IMSACCESS_CLIENT_SECRET'],
      'grant_type': "authorization_code",
      'code': os.environ['IMSACCESS_AUTH_CODE']
    }
    response = requests.post(IMS_URL, data=data)
    json_parse = json.loads(response.text)

    if response.status_code != 200:
      print(f"{POST_FAILURE_MESSAGE} {response.status_code}")
      print(response.text)
      sys.exit(1)
    elif find_string_in_json(json_parse, "error"):
      print(f"IMS token request failed with response code: {response.status_code}")
      print(response.text)
      sys.exit(1)
    else:
      print(f"IMS token request was successful: {response.status_code}")
      token = json_parse["access_token"]

    servicenow_get_cmr_url = f'{SERVICENOW_GET_CMR_URL}{os.environ["RETRIEVED_TRANSACTION_ID"]}'
    headers = {
      "Accept": APPLICATION_JSON,
      "Authorization":token,
      "api_key":os.environ['IPAAS_KEY']
    }

    # Wait 10 seconds to provide time for the transaction to exit the queue and be saved into ServiceNow as a CMR record.
    time.sleep(10)

    try:
      cmr_id = backoff_with_timeout(get_cmr_id_operation, max_retries=30, base_delay=1, max_delay=60, timeout=900)
      print(f"CMR ID found and validated: {cmr_id}")
      output_file.write(f"change_id={cmr_id}\n")
      output_file.close()
    except Exception as e:
      print(f"All CMR ID retrieval attempts failed: {e}")
      cmr_id = None
      output_file.write(f"change_id={cmr_id}\n")
      output_file.close()

    print("Setting Actual Maintenance Time Windows for CMR...")
    actual_start_time = int((datetime.datetime.now() - datetime.timedelta(seconds = 10)).timestamp())
    actual_end_time = int(datetime.datetime.now().timestamp())

    print("Closing CMR in ServiceNow...")

    close_notes = f"The change request is closed as the change was released successfully.\nPull Request Merged At: {os.environ['PR_MERGED_AT']}"

    headers = {
      "Accept": APPLICATION_JSON,
      "Authorization":token,
      "Content-Type": APPLICATION_JSON,
      "api_key":os.environ['IPAAS_KEY']
    }
    data = {
      "id": os.environ['RETRIEVED_TRANSACTION_ID'],
      "actualStartDate": actual_start_time,
      "actualEndDate": actual_end_time,
      "state": "Closed",
      "closeCode": "Successful",
      "notes": close_notes
    }
    response = requests.post(SERVICENOW_CMR_URL, headers=headers, json=data)
    json_parse = json.loads(response.text)

    if response.status_code != 200:
      print(f"{POST_FAILURE_MESSAGE} {response.status_code}")
      print(response.text)
      sys.exit(1)
    elif find_string_in_json(json_parse, "error"):
      print(f"CMR closure failed with response code: {response.status_code}")
      print(response.text)
      sys.exit(1)
    else:
      print(f"CMR closure was successful: {response.status_code}")
      print(response.text)

    print("Change Management Request has been closed.")
    print(f"You can find the change record in ServiceNow https://adobe.service-now.com/now/change-launchpad/homepage, by searching for this ID: {cmr_id}")
    print("")
    print("If the CMR ID is not found, search for the change record in ServiceNow by the planned start time and/or planned end time found in the slack message sent by the workflow in the #milo-changelog channel.")
    print("")
    print(f"If all else fails, please check the ServiceNow queue for transaction ID '{os.environ['RETRIEVED_TRANSACTION_ID']}' and validate that the CMR was created successfully by reaching out to the Change Management team in the #unified-change-management-support slack channel.")
