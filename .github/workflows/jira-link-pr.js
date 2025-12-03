const { getLocalConfigs } = require('./helpers.js');

const JIRA_TICKET_PATTERN = /MWPW-\d+/gi;

/**
 * Extract Jira ticket IDs from PR title and branch name
 * @param {string} title - PR title
 * @param {string} branch - Branch name
 * @returns {string[]} - Array of unique ticket IDs (uppercase)
 */
const extractTicketIds = (title, branch) => {
  const titleMatches = title?.match(JIRA_TICKET_PATTERN) || [];
  const branchMatches = branch?.match(JIRA_TICKET_PATTERN) || [];

  const allMatches = [...titleMatches, ...branchMatches].map((id) =>
    id.toUpperCase()
  );

  return [...new Set(allMatches)];
};

/**
 * Verify that a Jira ticket exists
 * @param {string} ticketId - Jira ticket ID
 * @returns {Promise<boolean>}
 */
const verifyTicketExists = async (ticketId) => {
  const jiraBaseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_USER_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

  const response = await fetch(
    `${jiraBaseUrl}/rest/api/2/issue/${ticketId}?fields=key`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    }
  );

  return response.ok;
};

/**
 * Create a remote link in Jira for the PR
 * @param {string} ticketId - Jira ticket ID (e.g., MWPW-123456)
 * @param {object} prData - PR data from GitHub
 * @returns {Promise<Response>}
 */
const createRemoteLink = async (ticketId, prData) => {
  const { html_url: htmlUrl, number, title } = prData;
  const jiraBaseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_USER_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;

  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

  const response = await fetch(
    `${jiraBaseUrl}/rest/api/2/issue/${ticketId}/remotelink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        globalId: `github-pr-${number}`,
        application: {
          type: 'com.github',
          name: 'GitHub',
        },
        relationship: 'Pull Request',
        object: {
          url: htmlUrl,
          title: `PR #${number}: ${title}`,
          icon: {
            url16x16: 'https://github.com/favicon.ico',
            title: 'GitHub Pull Request',
          },
        },
      }),
    }
  );

  return response;
};

const main = async ({ context }) => {
  try {
    const { pull_request: pullRequest } = context.payload;
    if (!pullRequest) {
      console.log('No pull request found in context. Exiting.');
      return;
    }

    const { title, head, html_url: htmlUrl, number } = pullRequest;
    const branch = head?.ref || '';

    console.log(`Processing PR #${number}: ${title}`);
    console.log(`Branch: ${branch}`);

    const ticketIds = extractTicketIds(title, branch);

    if (ticketIds.length === 0) {
      console.log(
        'No Jira ticket ID found in PR title or branch name. Skipping.'
      );
      return;
    }

    console.log(`Found ticket IDs: ${ticketIds.join(', ')}`);

    for (const ticketId of ticketIds) {
      try {
        const exists = await verifyTicketExists(ticketId);
        if (!exists) {
          console.log(
            `Ticket ${ticketId} not found or not accessible. Skipping.`
          );
          continue;
        }

        const response = await createRemoteLink(ticketId, pullRequest);

        if (response.ok) {
          console.log(`Successfully linked PR #${number} to ${ticketId}`);
        } else if (response.status === 400) {
          const errorData = await response.json();
          const alreadyExists = errorData.errors?.some((e) =>
            e.toLowerCase().includes('already exists')
          );
          if (alreadyExists) {
            console.log(`Remote link already exists for ${ticketId}. Skipping.`);
          } else {
            console.error(
              `Failed to link to ${ticketId}: ${JSON.stringify(errorData)}`
            );
          }
        } else {
          const errorText = await response.text();
          console.error(
            `Failed to link to ${ticketId}: ${response.status} - ${errorText}`
          );
        }
      } catch (error) {
        console.error(`Error processing ticket ${ticketId}: ${error.message}`);
      }
    }

    console.log('Jira link process completed.');
  } catch (error) {
    console.error('Error in jira-link-pr:', error);
  }
};

if (process.env.LOCAL_RUN) {
  const { context } = getLocalConfigs();
  main({ context });
}

module.exports = main;
