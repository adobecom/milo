import { readFileSync } from 'fs';

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

    const allMatches = [...titleMatches, ...branchMatches].map((id) => id.toUpperCase());

    return [...new Set(allMatches)];
};

/**
 * Fetch IMS access token for iPaaS authentication
 * @returns {Promise<string>} - IMS access token
 */
const getImsToken = async () => {
    const imsUrl = process.env.JIRA_SYNC_IMS_URL;
    const clientId = process.env.JIRA_SYNC_IMS_CLIENT_ID;
    const clientSecret = process.env.JIRA_SYNC_IMS_CLIENT_SECRET;
    const authCode = process.env.JIRA_SYNC_IMS_AUTH_CODE;

    const formData = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: authCode,
    });

    const response = await fetch(imsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`IMS token request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
};

/**
 * Get headers for iPaaS Jira API requests (JiraProxyV2 with PAT auth)
 * @param {string} imsToken - IMS access token
 * @returns {object} - Headers object
 */
const getJiraHeaders = (imsToken) => ({
    Authorization: imsToken,
    'x-authorization': `Bearer ${process.env.JIRA_SYNC_PAT}`,
    Api_key: process.env.JIRA_SYNC_IPAAS_KEY,
    Accept: 'application/json',
    'Content-Type': 'application/json',
});

/**
 * Verify that a Jira ticket exists
 * @param {string} ticketId - Jira ticket ID
 * @param {string} imsToken - IMS access token
 * @returns {Promise<boolean>}
 */
const verifyTicketExists = async (ticketId, imsToken) => {
    const ipaasUrl = process.env.JIRA_SYNC_IPAAS_URL;

    const response = await fetch(`${ipaasUrl}/issue/${ticketId}?fields=key`, {
        method: 'GET',
        headers: getJiraHeaders(imsToken),
    });

    return response.ok;
};

/**
 * Create a remote link in Jira for the PR
 * @param {string} ticketId - Jira ticket ID (e.g., MWPW-123456)
 * @param {object} prData - PR data from GitHub
 * @param {string} repoName - Repository name
 * @param {string} imsToken - IMS access token
 * @returns {Promise<Response>}
 */
const createRemoteLink = async (ticketId, prData, repoName, imsToken) => {
    const { html_url: htmlUrl, number, title } = prData;
    const ipaasUrl = process.env.JIRA_SYNC_IPAAS_URL;

    const response = await fetch(`${ipaasUrl}/issue/${ticketId}/remotelink`, {
        method: 'POST',
        headers: getJiraHeaders(imsToken),
        body: JSON.stringify({
            globalId: `github-pr-${repoName}-${number}`,
            application: {
                type: 'com.github',
                name: 'GitHub',
            },
            relationship: 'Pull Request',
            object: {
                url: htmlUrl,
                title: `[${repoName}] PR #${number}: ${title}`,
                icon: {
                    url16x16: 'https://github.com/favicon.ico',
                    title: 'GitHub Pull Request',
                },
            },
        }),
    });

    return response;
};

const main = async ({ context }) => {
    try {
        const { pull_request: pullRequest, repository } = context.payload;
        if (!pullRequest) {
            console.log('No pull request found in context. Exiting.');
            return;
        }

        const { title, head, html_url: htmlUrl, number } = pullRequest;
        const branch = head?.ref || '';
        const repoName = repository?.name || 'unknown';

        console.log(`Processing PR #${number}: ${title}`);
        console.log(`Repository: ${repoName}`);
        console.log(`Branch: ${branch}`);

        const ticketIds = extractTicketIds(title, branch);

        if (ticketIds.length === 0) {
            console.log('No Jira ticket ID found in PR title or branch name. Skipping.');
            return;
        }

        console.log(`Found ticket IDs: ${ticketIds.join(', ')}`);

        console.log('Fetching IMS token...');
        const imsToken = await getImsToken();
        console.log('IMS token obtained successfully.');

        for (const ticketId of ticketIds) {
            try {
                const exists = await verifyTicketExists(ticketId, imsToken);
                if (!exists) {
                    console.log(`Ticket ${ticketId} not found or not accessible. Skipping.`);
                    continue;
                }

                const response = await createRemoteLink(ticketId, pullRequest, repoName, imsToken);

                if (response.ok) {
                    console.log(`Successfully linked PR #${number} to ${ticketId}`);
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    const alreadyExists = errorData.errors?.some((e) => e.toLowerCase().includes('already exists'));
                    if (alreadyExists) {
                        console.log(`Remote link already exists for ${ticketId}. Skipping.`);
                    } else {
                        console.error(`Failed to link to ${ticketId}: ${JSON.stringify(errorData)}`);
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Failed to link to ${ticketId}: ${response.status} - ${errorText}`);
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

// Read GitHub event payload and run
const eventPath = process.env.GITHUB_EVENT_PATH;
const payload = JSON.parse(readFileSync(eventPath, 'utf8'));
main({ context: { payload } });
