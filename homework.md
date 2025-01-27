Create a repository
Initialize the repository
node_modules, pakage.json, package-lock.json
Install express
Listen to port 3000
Write request handler for /test , /hello
Insall nodemon and update scripts inside package.json
What are dependencies
What is the use of "-g" while npm install
Difference bitween caret and tilde (^ vs ~)

initialize git
.gitinore
Create a remote repo on github
Push all code to remote origin
Play with routes and route extensions ex. /hello,/hello/2, /test. /
Write logic to handle GET,POST, PATCH , DELETE API calls and test them on postman 
Explore routing and use of ?, +, (), * in the routes
Use of regex in routes /a/, /.*fly$/
Reading the query params in the routes
Reading the dynamic routes 

Multiple Route handlers play with the code 
next()
next function and error along with res.send()
app.use("/route, rh,[rh2,rh3],rh4,rh5");
what is middleware? why do we need it ?
how express JS basically handles requests behind the scenes
Difference app.use and app.all
write a dummy auth middleware for admin
write a dummy auth middleware for all user routes , except /user /login
Error Handling usingapp.use("/", (err, req,res, next)=>{});




Validate data in Signup API
Install bcryptpackage
Create PasswordHash using bcrypt.hash & save the user is excrupted password
Create login API
Compare password and throw error if email or password is invalid