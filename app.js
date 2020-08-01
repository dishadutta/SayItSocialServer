const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();


//db
//MONGO_URI=mongodb://localhost/nodeapi
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log("DB Connected"));

// mongoose.connection.on("error", err => {
//   console.log(`DB Connection error ${err.message}`);
// });


//bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

//Documenting API
app.get("/", (req, res) => {
  fs.readFile("docs/apidocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: "Unauthorized!!"});
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
