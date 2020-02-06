#Import dependencies
import os
import slack
from flask import Flask, request, make_response

#Load dotenv
from dotenv import load_dotenv
load_dotenv()

#Set Vars
slack_client = slack.WebClient(token=os.environ['PARL_SLACK_KEY'])
starterbot_id = None

#Start Flask app
app = Flask(__name__)

@app.route('/table', methods=['POST'])
def inbound_command():
    # Parse the request payload
    payload_json = request.form
    # Verify that the request came from Slack
    #if os.environ['SLACK_VERIFICATION_TOKEN'] != payload_json["token"]:
    #    raise("Invalid Verification Token")
    print(payload_json["command"])
    return make_response("",200)

if __name__ == "__main__":
    starterbot_id = slack_client.api_call("auth.test")["user_id"]
    print(starterbot_id)
