import os

def handle_command(command,slack_client):
    user_profile = slack_client.users_profile_get(token=os.environ['PARL_OAUTH_KEY'],user=command["user_id"])["profile"]
    user_party = user_profile["status_text"]

    msgBlocks = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "Mr Speaker, the Honourable "+ user_party + " has requested to table the following motion: ```" + command["text"] + "```"
        }
    },
    {
			"type": "divider"
	},
    {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Following the established SPP, the motion is required to be seconded by another member of the parliament before proceeding to the next stages. "
			},
    },
    {
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Second Motion",
						"emoji": true
					},
					"value": "true"
				}
			]
		}
    ]

    slack_client.chat_postMessage(
        channel=command["channel_id"],
        blocks=msgBlocks,
        user=command["user_id"])

def handle_second(user_id,payload,slack_client):
    if json["callback_id"] ==
