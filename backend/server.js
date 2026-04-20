
const connect = require('./src/DB/db')

const app = require('./src/app')
const port = process.env.PORT;
connect();


app.listen(port,()=>{
    console.log(`server is running on the port ${port}`)
} )