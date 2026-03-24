How to run a single nala test for debugging (filename will end in "test.js"):

  npm run nala stage mep-button.test.js mode=debug

You can replace "stage" with your local branch for local testing.

  npm run nala my-local-branch mep-button.test.js mode=debug

You may also want to run this for help information: 

  npm run nala help

Note: you may need to sync your local branch with stage to get the latest nala tests in order for them to pass.

To run all of our nala tests:
  npm run nala stage tag=mep

Another option -- watch the test in a browser:
mode=headed

