# AuthEasy
An attempt to build a NodeJS library that simplifies authentication processes.

In Progress.

### How to make it better?
 1. While the async login/register functions have been built with sync practices, issue arises in trial.js where each function     call has to be done with async-await to enforce sync characteritics. While this may not be an issue in regular applications
    where the function calls happen at different files with there own execution threads, ideally this issue should be resolved

### What does it consist of?
1. Store URI function
2. Connect
3. Async/Sync Register Functions
4. Async/Sync Login Functions
5. bcrypt being used

### What to add?
1. Reset password
2. CHECK OWASP FOR PASSWORD STUFF
3. SHA 512 and few other 

NOTE:  USER SHOULD BE CONCERNED WITH ONLY 5-6 LINES
