require("dotenv").config();
const cookie = require('cookie-parser');
const authRourte = require('./routes/auth.route');
const express = require('express')
const cors = require('cors')
const interviewRoute = require('./routes/interview.route');
const app = express();

app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));





app.use('/auth',authRourte)

app.use('/interview',interviewRoute)

module.exports=app