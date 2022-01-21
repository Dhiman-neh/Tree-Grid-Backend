const express = require("express");
var cors = require('cors')
var app = express()
app.use(cors())
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const routes = require("./routes/index");
app.use("/", routes);
app.listen(3005, () => {
    console.log('Server runs on port 3005')
})