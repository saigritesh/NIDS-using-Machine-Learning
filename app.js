// jshint esversion:6

require('dotenv').config();
currentYear = new Date().getFullYear();
const { parse, stringify } = require('flatted');
let { PythonShell } = require('python-shell');
const express = require("express");
var multer = require('multer');
const download = require('download');
const fs = require('fs');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Set global variable for currentYear if needed in EJS views via app.locals
app.locals.currentYear = currentYear;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());

// --- Authentication Routes ---
// POST route for login (No Authentication)
app.post("/login", function (req, res) {
  res.cookie('user', req.body.username, { maxAge: 900000, httpOnly: true });
  res.redirect("/submit");
});

// Submit Route
app.get("/submit", function (req, res) {
  if (req.cookies?.user) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

// Logout Route
app.get("/logout", function (req, res) {
  res.clearCookie("user");
  res.redirect("/");
});

// --- File Upload Setup ---
submitted_csv_file = "";
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './Uploaded_files');
  },
  filename: function (req, file, callback) {
    submitted_csv_file = file.originalname;
    console.log(submitted_csv_file);
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage }).single('myfile');

// --- Main Routes ---
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/secrets", function (req, res) {
  complete_answer = ""
  // knn
  knn_bin_cls = ""
  knn_mul_cls = ""
  knn_desc = ""
  knn_bin_acc = "0.9760368900303525"
  knn_mul_acc = "0.9740368900303525"
  // random forest
  rf_bin_cls = ""
  rf_mul_cls = ""
  rf_desc = ""
  rf_bin_acc = "0.9741029652113005"
  rf_mul_acc = "0.9731029652113005"
  // cnn
  cnn_bin_cls = ""
  cnn_mul_cls = ""
  cnn_desc = ""
  cnn_bin_acc = "0.9582535605883726"
  cnn_mul_acc = "0.9506420733130982"
  // lstm
  lstm_bin_cls = ""
  lstm_mul_cls = ""
  lstm_desc = ""
  lstm_bin_acc = "0.9562456222274107"
  lstm_mul_acc = "0.9590940929255195"

  res.render("secrets");
  let options = {
    args: [],
    // OPTIONAL: If needed, set a specific pythonPath here:
    // pythonPath: "C:/Users/SAI GRITESH/AppData/Local/Programs/Python/Python313/python.exe"
  };
  console.log("entering!!");
  PythonShell.run('nids_random_updated.py', options, (err, response) => {
    if (err)
      console.log(err);
    if (response) {
      complete_answer = stringify(response);
      // Process response details (for knn, random forest, cnn, lstm)
      temp_knn_bin_cls = stringify(response[0]);
      knn_bin_cls = temp_knn_bin_cls.slice(2, -2);
      temp_knn_mul_cls = stringify(response[1]);
      knn_mul_cls = temp_knn_mul_cls.slice(2, -2);
      temp_knn_desc = stringify(response[2]);
      knn_desc = temp_knn_desc.slice(2, -2);
      // Random forest processing
      temp_rf_bin_cls = stringify(response[3]);
      rf_bin_cls = temp_rf_bin_cls.slice(2, -2);
      temp_rf_mul_cls = stringify(response[4]);
      rf_mul_cls = temp_rf_mul_cls.slice(2, -2);
      temp_rf_desc = stringify(response[5]);
      rf_desc = temp_rf_desc.slice(2, -2);
      // CNN processing
      temp_cnn_bin_cls = stringify(response[6]);
      cnn_bin_cls = temp_cnn_bin_cls.slice(2, -2);
      temp_cnn_mul_cls = stringify(response[7]);
      cnn_mul_cls = temp_cnn_mul_cls.slice(2, -2);
      temp_cnn_desc = stringify(response[8]);
      cnn_desc = temp_cnn_desc.slice(2, -2);
      // LSTM processing
      temp_lstm_bin_cls = stringify(response[9]);
      lstm_bin_cls = temp_lstm_bin_cls.slice(2, -2);
      temp_lstm_mul_cls = stringify(response[10]);
      lstm_mul_cls = temp_lstm_mul_cls.slice(2, -2);
      temp_lstm_desc = stringify(response[11]);
      lstm_desc = temp_lstm_desc.slice(2, -2);
      console.log("entered!!");
    }
  });
});

app.get("/secrets_2", function (req, res) {
  res.render("secrets_2");
});

app.get("/paramsecrets", function (req, res) {
  res.render("paramsecrets");
});

// Parameterized prediction route
app.post("/parameters", function (req, res) {
  const submitted_protocol_type = req.body.protocol_type;
  const submitted_service = req.body.service;
  const submitted_flag = req.body.flag;
  const submitted_logged_in = req.body.logged_in;
  const submitted_count = req.body.count;
  const submitted_srv_serror_rate = req.body.srv_serror_rate;
  const submitted_srv_rerror_rate = req.body.srv_rerror_rate;
  const submitted_same_srv_rate = req.body.same_srv_rate;
  const submitted_diff_srv_rate = req.body.diff_srv_rate;
  const submitted_dst_host_count = req.body.dst_host_count;
  const submitted_dst_host_srv_count = req.body.dst_host_srv_count;
  const submitted_dst_host_same_srv_rate = req.body.dst_host_same_srv_rate;
  const submitted_dst_host_diff_srv_rate = req.body.dst_host_diff_srv_rate;
  const submitted_dst_host_same_src_port_rate = req.body.dst_host_same_src_port_rate;
  const submitted_dst_host_serror_rate = req.body.dst_host_serror_rate;
  const submitted_dst_host_rerror_rate = req.body.dst_host_rerror_rate;

  let options = {
    args: [submitted_protocol_type, submitted_service, submitted_flag, submitted_logged_in, submitted_count,
           submitted_srv_serror_rate, submitted_srv_rerror_rate, submitted_same_srv_rate, submitted_diff_srv_rate,
           submitted_dst_host_count, submitted_dst_host_srv_count, submitted_dst_host_same_srv_rate,
           submitted_dst_host_diff_srv_rate, submitted_dst_host_same_src_port_rate,
           submitted_dst_host_serror_rate, submitted_dst_host_rerror_rate]
  };
  console.log("entering!!");
  PythonShell.run('nids_parameter_updated.py', options, (err, response) => {
    if (err)
      console.log(err);
    if (response) {
      console.log("entered!!");
      p_complete_answer = stringify(response);
      // Process and slice responses as needed...
    }
  });
  res.redirect("/paramsecrets");
});

// CSV route example
app.get("/csv", function (req, res) {
  res.sendFile(__dirname + "/csv");
});

final_ans = ""
app.post('/uploadjavatpoint', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.")
    }
    res.end("File is uploaded successfully!");
    console.log("hello");
    const submitted_model = req.body.selected_model;
    console.log(submitted_model);
    console.log(submitted_csv_file);
    let options = {
      args: [submitted_model, submitted_csv_file]
    };
    PythonShell.run('nids_csv_updated.py', options, (err, response) => {
      if (err)
        console.log(err);
      if (response) {
        temp_final_ans = stringify(response[0]);
        final_ans = temp_final_ans.slice(2, -2);
        console.log("completed");
      }
    });
  });
});

l = "completed!!"
app.get('/index', (req, res) => {
  if (l == final_ans) {
    console.log("yes");
    res.render('index');
  }
});

app.get('/download-file', (req, res) => {
  console.log("entered");
  let filePath = './Uploaded_files/' + submitted_csv_file;
  res.download(filePath);
});

// Additional static routes
app.get("/features", function (req, res) { res.render("features"); });
app.get("/attacks", function (req, res) { res.render("attacks"); });
app.get("/about", function (req, res) { res.render("about"); });
app.get("/knn_bin_table", function (req, res) { res.render("knn_bin_table"); });
app.get("/rf_bin_table", function (req, res) { res.render("rf_bin_table"); });
app.get("/cnn_bin_table", function (req, res) { res.render("cnn_bin_table"); });
app.get("/lstm_bin_table", function (req, res) { res.render("lstm_bin_table"); });
app.get("/knn_table", function (req, res) { res.render("knn_table"); });
app.get("/rf_table", function (req, res) { res.render("rf_table"); });
app.get("/cnn_table", function (req, res) { res.render("cnn_table"); });
app.get("/lstm_table", function (req, res) { res.render("lstm_table"); });
app.get("/stats", function (req, res) { res.render("stats"); });
app.get("/parameters", function (req, res) { res.render("parameters"); });
app.get("/contact", function (req, res) { res.render("contact"); });
app.get("/login", function (req, res) { res.render("login"); });
app.get("/register", function (req, res) { res.render("register"); });

app.get("/logout", function (req, res) {
  res.clearCookie("user");
  if (submitted_csv_file !== "") {
    const path = './Uploaded_files/' + submitted_csv_file;
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('File deleted');
      submitted_csv_file = "";
    });
  }
  res.redirect('/');
});

app.post("/register", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save().then(() => {
    res.redirect("/login");
  }).catch((err) => {
    console.log("error in register!!");
    console.log(err);
    res.redirect("/register");
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on port 3000.");
});
