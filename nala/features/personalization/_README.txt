
1) Run all tests on a single test file (the filename will end in "test.js"). 
This example includes the debugger.

  npm run nala stage mep-order.test.js mode=debug


2) Or to run a single test, you can find its name from its "spec" file, such as @all-elements0

  npm run nala stage @all-elements0 mode=debug


3) You may also want to run this for help documentation: 

  npm run nala help


4) To run all of our nala tests:

  npm run nala stage tag=mep


5) Another option: run the tests in a visible browser

  mode=headed

  npm run nala stage @all-elements0 mode=headed


6) To run a nala test on a specific local branch instead of "stage", replace "stage" in the above examples with the desired branch name. This is useful when your branch breaks a nala test and you want to check for a fix.

  npm run nala current-branch mep-button.test.js 
  npm run nala local @test1 mode=debug 

You may need to sync your local branch with stage to get other nala tests to pass.

If you encounter errors, you might need to install dependencies:

npm install
or
sudo npm install (on a Mac)

See https://github.com/adobecom/nala for more information.

Learn how to autogenerate playwright code (but you may have to use a different workspace):
https://playwright.dev/docs/codegen

