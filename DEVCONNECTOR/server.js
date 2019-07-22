const express = require('express');
const connectDB = require('./config/db');

// routes variables
const userRoute = require('./routes/api/users');
const postsRoute = require('./routes/api/posts');
const profileRoute = require('./routes/api/profile');
const authRoute = require('./routes/api/auth');


const app = express();

// Connect Database
connectDB();

// Middleware initialization
/*
* Usually we used to install body parser and do
* app.use(bodyparser.json()). But now bodyparser comes
* packaged with express. So we just have to do express.json()
* to use bodyparser
*/
app.use(express.json({extended: false}));

app.get("/", (req,res) => {res.send('API Running')});

// Define Routes

app.use('/api/users', userRoute );
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);




/*
* This means when the app will be deployed to heroku, it will
* look for a port specified by heroku. But since right now
* locally we don't have that, we will be running the app on
* port 5000
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});