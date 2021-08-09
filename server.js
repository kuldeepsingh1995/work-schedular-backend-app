// require('dotenv').config();

const http = require("http");
const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
// const User = require('./models/User');

// Server Configuration
const app = express();

app.use('/uploads', express.static('uploads'));

const db = require("./models");
// { force: true }
db.sequelize.sync().then(() => {
    console.log("Drop and re-sync db.");
  });
const server = http.createServer(app);
const port = process.env.PORT || 4001;
// global.io = require("socket.io")(server); 
server.listen(port, () => console.log(`Listening on port ${port}`));


// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route Handling
app.use(require("./routes/index"));


 
// Error Handling
app.use((req, res, next) => {
    const error = new Error("Route Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        success: false,
        error: error.message,
    });
});