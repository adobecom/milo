/* eslint-disable import/no-extraneous-dependencies, no-console */

import axios from 'axios';

/**
 * Sends a message to Slack using a webhook URL.
 * @param {string} webhookUrl - The Slack channel webhook.
 * @param {Object} messageContent - The content of the message to send.
 */
export default async function sendSlackMessage(webhookUrl, messageContent) {
  try {
    const response = await axios.post(webhookUrl, messageContent, { headers: { 'Content-Type': 'application/json' } });

    if (response.status !== 200) {
      throw new Error(`Error sending message to Slack. Status: ${response.status}. Message: ${response.data}`);
    }
    console.log('---Result summary is sent to slack---');
  } catch (error) {
    console.error('Axios error:', error);
  }
}
