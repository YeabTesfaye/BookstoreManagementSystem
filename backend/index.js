require('dotenv').config()
const app = require('./app')
const http  = require('http')
const colors = require('colors')
const CONNECTDB = require('./config/db')
CONNECTDB()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`the sever is listing at port ${PORT}`);
})

