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

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);





app.use('/auth',authRourte)

app.use('/interview',interviewRoute)

module.exports=app