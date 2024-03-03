const express = require("express");
const app = express();
const mainRouter = require('./routes/index');
const cors = require('cors');   // give access to hit another frontend to hit these endpoints

app.use(express.json());        // bodyParser for post requests
app.use(cors());

// getting routes, means we saying all request are comming to api/v1 will go to router/index.js there router will handle all api's
// api/v1 coz all its common binance root url api's starts from there
app.use("/api/v1", mainRouter);

app.listen(3000);