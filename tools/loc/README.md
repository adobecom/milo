# project to Translation tool

This Helix tool helps to go from a list of pages to a set of translation tasks in GLaaS and WorldServer and to bring the translated files back into Sharepoint.

## Pre-requisites

- End user must have access to the **Project Sharepoint site**
- End user must have access to the **GLaaS production/stage system** and have access to the **corresponding project(s)** - see configuration to know the list of projects
- End user must **be connected to Adobe VPN**

## Config

The document `/drafts/localization/configs/config.xlsx` contains the tool config. 
Warning: edit the config carefuly, an invalid config might break the tool

- `helix-locales` sheet: the list of locales available and their mapping to the `path` (`fr-FR` -> `/fr`) and to the workflow used for translation per locale.
- `helix-workflows` sheet: the list of workflows available and their mapping to the GLaaS product / project / workflowName - the end user must have access to those to be able to create the translation tasks
- `helix-glaas` sheet (technical - CHANGE ONLY IF YOU KNOW WHAT YOU ARE DOING): GLaaS connection parameters
- `helix-sp` sheet (technical - CHANGE ONLY IF YOU KNOW WHAT YOU ARE DOING): Sharepoint connection parameters

## Usage

- Create a new Excel spreadsheet (project document) in a folder under `drafts` in the Project Sharepoint site

  - The project document must at least contains one `URL` column and one or more "locale(s)" (`fr-FR`, `ru-RU`...) columns
  - The list of supported locales is defined in the config file
  - The document can have as many columns as necessary (status, info...), only the `URL` and the known locales are considered
  - The `URL` column must contain a list of Project valid URLs
  - For each locale column, a `Y` or `y` would mean the page must be translated. For any other string, the translation will be skipped.
  
- The name of the Excel spreadsheet (e.g. `7174_Helix_WS_Pilot_MONTH_YEAR`) will be used to create the tasks in WorldServer and can be used to find them.

- When done with creating the project document, open the Sidekick and hit the "Translate from project" button.

- The tool is opened in a new tab
- End user will need to connect to GLaaS and Sharepoint (first time only and when authentication token expires)
  
  - Note: 2 popups must appear consecutively with OKTA authentication. If this is NOT the case, you need to allow the popups for the page (icon at the right of the address bar)
  - Note 2: after 2 approval the Sharepoint authentication says you are not allowed to connect, just close the popup and reload the browser window (bug to be fixed).

- The tool expose then the list of URLs and locales it computed from the project file. Review the list.
- At this time, end user can still go back to the project and make some changes to it. Just hit the "Reload" button to get the latest updates (might require multiple reloads until the hlx3 migration is completed).
- When ready to kick-off the translation tasks, hit the "Send to GLaaS" button.
- For each locale, a task in GLaaS will be created and all corresponding files will be attached to it. This would then trigger the tasks in WorldServer (or only in GLaaS for Machine Translation).
- From now on, any change to the project will be ignored. If you need to add more translations, you will need to create a new project with a new unique name.
- You can hit the refresh button to see if some files have been translated already or just re-open the tool from the project spreadsheet like in step 4.
- Once a file has been translated and is available, you can:

  - Download: downloads a copy of the translation for a specific locale on your local hard drive
  - Preview: opens a new window to preview the translation on the website
  - Create a version in Sharepoint: this puts the translated file at its right place in the Sharepoint structure
  - Overwrite version in Sharepoint: same as previous except that the tool has detected that the file is already there. A confirmation is required to avoid overwriting something accidently.
  - You can also "Save all {locale} in Sharepoint": it does the same than Create / Overwrite buttons but goes through the list of URLs. A confirmation is asked for each file that requires overwrite, rejecting does not stop the iteration to the next files.

Here is a recording illustrating the process: [project to Translation demo](https://adobe-my.sharepoint.com/:v:/p/acapt/Ec3kU1tZZXdGse9vGUoa1TkBhLVUrW3srjLN4B1sP1DUwQ?e=gFdWwt)

## Note on content

The files to be translated contains `metadata` or technical strings that must stay in English. There are 2 ways to do it:

1. Create a `DNT` style and apply it to the corresponding text
2. Create a style and apply the `Hidden` font effect (and do not forget to enable `Preferences > View > Show non printing characters > Hidden Text`).

## Development

The tricky part for development is to NOT poluate the production environment with either GLaaS / WorldServer tests tasks and to not overwrite the production localized documents when working on the write back from GLaaS.
Setup recommendation:
- create a new Sharepoint test site or use your personal one
- create and branch and update the `fstab.yaml` with the Sharepoint test site
- clone some of the content (you will need some valid URLs)
- clone `/drafts/localization/configs/config.xlsx` and update the sheets:

  - `helix-glaas`: use the `https://stage-glaas.corp.adobe.com` URL
  - `helix-sp`: update the site URL
  - `helix-locales` can stay the same
  - `helix-workflows`: the workflow names might slighty differ on stage - need to check with the GLaaS team to get access and find some testing product / project. Can be anything for testing. For development, it is also convienent to use "Machine Translation" workflow to get translated files quickly.

  ### Redirect URLs

  As part of the oAuth process, the third-party oAuth integrations requires to define the redirect URLs to allow the authentication. This is done:

  - for Sharepoint: `Azure Active Directory > App registrations > Helix project to Translation > Redirect URIs` - [direct link](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Authentication/appId/008626ae-f818-43d8-9d7f-26afe05e771d/isMSAApp/)
  - for GLaaS: send a request to the GLaaS tech team (Anuj / Rajeev) with url like: `${hostname}/tools/translation/glaas.html`

  Both are configured for localhost (on the staging environment only for GLaaS). If you are working with a branch and the hlx.page domain, this would need to be registered.
