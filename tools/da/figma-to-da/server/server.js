/*
 * Figma → DA Agent Server (milo)
 *
 * Setup (Anthropic API key):
 *   ANTHROPIC_API_KEY=sk-...  REPO_PATH=/path/to/milo  npm start
 *
 * Setup (AWS Bedrock):
 *   AWS_BEARER_TOKEN_BEDROCK=...  AWS_REGION=us-west-2  \
 *   BEDROCK_MODEL_SMART=us.anthropic.claude-sonnet-4-6   \
 *   REPO_PATH=/path/to/milo  npm start
 *
 * Then expose with ngrok:
 *   ngrok http 3001   ← paste the HTTPS URL into the DA app
 *
 * Endpoints:
 *   POST /jobs  { figmaUrl, daContext }  → 202 { jobId }
 *   GET  /jobs/:id                       → { status, previewUrl?, error? }
 */

import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { query } from '@anthropic-ai/claude-agent-sdk';

const PORT = process.env.PORT || 3001;
const REPO_PATH = process.env.REPO_PATH;

if (!REPO_PATH) {
  console.error('ERROR: Set REPO_PATH env var to the milo repo root.');
  process.exit(1);
}

if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
  process.env.CLAUDE_CODE_USE_BEDROCK = '1';
  console.log(`Using Bedrock in ${process.env.AWS_REGION || 'us-east-1'}`);
} else {
  console.log('Using Claude Code built-in auth');
}

const app = express();
app.use(cors());
app.use(express.json());

/** @type {Map<string, { status: string, previewUrl?: string, error?: string }>} */
const jobs = new Map();

app.post('/jobs', async (req, res) => {
  const { figmaUrl, daContext } = req.body;

  if (!figmaUrl || !figmaUrl.includes('figma.com')) {
    return res.status(400).json({ error: 'figmaUrl must be a valid figma.com URL' });
  }

  const jobId = randomUUID();
  jobs.set(jobId, { status: 'pending' });
  res.status(202).json({ jobId });

  runAgent(jobId, figmaUrl, daContext).catch((e) => {
    jobs.set(jobId, { status: 'error', error: String(e) });
  });
});

app.get('/jobs/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

async function runAgent(jobId, figmaUrl, daContext) {
  const org = daContext?.org || 'adobecom';
  const site = daContext?.site || 'milo';
  const token = daContext?.token || '';
  const username = daContext?.username || 'anonymous';
  const daPath = `drafts/${username}/<slug>`;

  const prompt = `You are a DA page prototyper working in the milo AEM Edge Delivery Services repository.
Milo uses the C2 block system. All blocks live in libs/c2/blocks/ and must follow the C2 patterns described below.

Your task:
1. Fetch the Figma design at: ${figmaUrl}
   - Use WebFetch with the Figma REST API (GET https://api.figma.com/v1/files/:fileKey) if a token is available.
   - Extract key sections, layout, text, and color tokens from the design.
   - If the Figma API returns 403, synthesise a reasonable layout based on the file name and node ID.

2. Generate C2 block JS + CSS files for each major design section.
   - Create one block per section at libs/c2/blocks/<block-name>/<block-name>.js and .css
   - Block JS must export a default init(el) function — never self-invoke:
       export default function init(el) {
         // decorate el using DOM APIs
       }
   - Block CSS must use milo's --s2a-* design tokens for all colors, spacing, and typography:
       Colors: --s2a-color-gray-50 through --s2a-color-gray-900, --s2a-color-blue-500, etc.
       Spacing: --s2a-spacing-4, --s2a-spacing-8, --s2a-spacing-16, --s2a-spacing-24, --s2a-spacing-32, etc.
       Typography: --s2a-typography-body-md-size, --s2a-typography-heading-2-size, etc.
       Border radius: --s2a-border-radius-4, --s2a-border-radius-8, --s2a-border-radius-16, etc.
   - Use semantic HTML. No inline styles.
   - Do NOT create any HTML page files in git — pages live in DA, not the repo.

3. Register each new block name in the C2_BLOCKS array in libs/utils/utils.js.
   The array starts at line 111. Add the block name(s) in alphabetical order.

4. Commit ONLY the block files and utils.js to a new git branch named prototype-<slug>
   (use hyphens only, no slashes):
   git checkout -b prototype-<slug>
   git add libs/c2/blocks/ libs/utils/utils.js
   git commit -m "feat: prototype C2 blocks from Figma ${figmaUrl}"
   git push origin prototype-<slug>

5. Create the page in DA using the DA Source API.
   The DA path for this page is: drafts/${username}/<slug>
   First write the page HTML to /tmp/<slug>.html. The format is AEM EDS block HTML.
   Include <meta name="foundation" content="c2"> in <head> so milo resolves C2 blocks:
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="foundation" content="c2">
   </head>
   <body>
     <header></header>
     <main>
       <div class="block-name"><div><p>content</p></div></div>
     </main>
     <footer></footer>
   </body>
   </html>

   First ensure the user's drafts folder exists:
   curl -s -X POST "https://admin.da.live/source/${org}/${site}/drafts/${username}" -H "Authorization: Bearer ${token}"

   Then upload the page:
   curl -s -X POST "https://admin.da.live/source/${org}/${site}/drafts/${username}/<slug>.html" -H "Authorization: Bearer ${token}" -F "data=@/tmp/<slug>.html"

   Parse the JSON response and extract .aem.previewUrl — that is your PREVIEW_URL.

6. Your FINAL line of output must be exactly:
   PREVIEW_URL=<value of aem.previewUrl from the curl response>

   No text after this line. No summary.
   Replace <slug> with a short kebab-case name derived from the Figma file title.
   If the DA upload fails, output PREVIEW_URL=error and show the curl response above it.`;

  let previewUrl;

  const queryOptions = {
    cwd: REPO_PATH,
    permissionMode: 'bypassPermissions',
    allowedTools: ['Bash', 'Read', 'Write', 'Edit', 'WebFetch'],
    pathToClaudeCodeExecutable: process.env.CLAUDE_PATH || '/Users/cod87753/.local/share/claude/versions/2.1.140',
    stderr: (line) => process.stderr.write(`[agent ${jobId.slice(0, 8)}] ${line}`),
  };

  if (process.env.BEDROCK_MODEL_SMART) {
    queryOptions.model = process.env.BEDROCK_MODEL_SMART;
  }

  let finalResult = '';
  for await (const msg of query({ prompt, options: queryOptions })) {
    if (msg.type === 'result') {
      finalResult = msg.result || '';
      // Explicit marker (preferred)
      const explicit = finalResult.match(/PREVIEW_URL=(\S+)/);
      if (explicit) previewUrl = explicit[1];
      // Fallback: any aem.live or aem.page URL in the result text
      if (!previewUrl) {
        const fallback = finalResult.match(/https:\/\/[^\s"')]+\.aem\.(live|page)[^\s"')]+/);
        if (fallback) previewUrl = fallback[0];
      }
    }
  }

  if (!previewUrl) {
    // Agent finished without a URL — surface the result text so the user isn't left empty-handed
    jobs.set(jobId, {
      status: 'done',
      previewUrl: null,
      summary: finalResult.slice(0, 1000),
    });
    return;
  }

  jobs.set(jobId, { status: 'done', previewUrl });
}

app.listen(PORT, () => {
  console.log(`Agent server running on http://localhost:${PORT}`);
  console.log(`Repo path: ${REPO_PATH}`);
});
