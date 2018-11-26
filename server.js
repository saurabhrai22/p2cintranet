const http = require("http");
var express = require("express");
var path = require("path");
const fs = require("fs");
var app = express();
const cors = require('cors');
const sb = require("./libs/sidebar");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expsession = require('express-session');
const session = require('client-sessions');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const safezone = "./files";
const brands = 'public/brands';
const tools = 'public/tools';
const sem = "public/sem";
const seo = "public/seo";
const campaign = "public/campaign";
const other = "public/other";
const courses = "public/courses";
app.set("view engine", "ejs");
app.use(cors())
/* const hostname = "127.0.0.1"; */
const port = 3000;

var safezone_list = [];
var brands_list = [];
var tools_list = [];
var courses_list = [];
/* var sem_list=[];
var seo_list = [];
var campaign_list =[]; */
var other_list = [];
//Static Folder
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://10.212.190.59:27017/intranet', {
  useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({
      enterpriseId: req.session.user.enterpriseId
    }, function (err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user; //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});


app.post('/login', function (req, res) {
  User.findOne({
    enterpriseId: req.body.empid,

    active: true
  }, function (err, user) {
    if (user != null && bcrypt.compareSync(req.body.pass, user.password)) {

      req.session.user = user;
      res.send("success");

    } else {
      console.log("invalid");
      res.send('invalid');
    }

  });
});

app.post('/hasuser', function (req, res) {
  User.findOne({
    enterpriseId: req.body.empid,
    active: false
  }, function (err, user) {
    if (user != null) {
      //console.log("exists");

      res.send("exists");

    } else {
     // console.log("none");
      res.send('none');
    }

  });
});

/* Change password on user first login */
app.post('/changepassword', function (req, res) {
  

    bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
      User.findOneAndUpdate({
        enterpriseId: req.body.empid,
        active: false
      }, {
          $set: {
            active: true,
            password: hash
          }
        }, function (err, user) {
          if (err) {
            res.send(err);
          }
    
          if (user) {
            res.send("succcessful");
          } else {
    
            res.send("Unable to update the user details")
          }
        });
    });
});


app.post('/register', function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //console.log(hash);
    let newUser = new User({
      password: hash,
      enterpriseId: req.body.enterpriseId,
      active: false
    });

    newUser.save((err) => {
      if (err) {
        res.send(err);
      }
      res.send('succesful')

    });
  });

});
fs.readdir(safezone, function (err, files) {
  if (err) {
    throw err;
  }
  var obj = {};
  obj.name = "files";

  obj.list = [];
  var itemsProcessed = 0;
  files.forEach(file => {
    if (path.extname(file) == ".pdf") {
      obj.list.push(file);
      itemsProcessed++;
      if (itemsProcessed === files.filter(file => path.extname(file) == ".pdf").length) {
        safezone_list.push(obj);
      }
    }
  });
});

fs.readdir(courses, function (err, files) {
  if (err) {
    throw err;
  }
  var obj = {};
  obj.name = "courses";

  obj.list = [];
  var itemsProcessed = 0;
  files.forEach(file => {
    if (path.extname(file) == ".pdf") {
      obj.list.push(file);
      itemsProcessed++;
      if (itemsProcessed === files.filter(file => path.extname(file) == ".pdf").length) {
        courses_list.push(obj);
        // console.log(courses_list)
      }
    }
  });
});


//Create brands object
fs.readdir(brands, function (err, files) {
  if (err) {
    throw err;
  }

  files.map(function (file) {
    return path.join(brands, file);
  }).filter(function (file) {
    return fs.statSync(file).isDirectory();
  }).forEach(function (file) {

    var temp = file.replace('public\\brands\\', '');
    fs.readdir(brands + "/" + temp, (err, files) => {
      var obj = {};
      obj.name = temp;
      obj.list = [];
      var itemsProcessed = 0;
      files.forEach(file => {
        if (path.extname(file) == ".html") {
          obj.list.push(file);
          itemsProcessed++;
          if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length) {
            brands_list.push(obj);
            //console.log(sem_list);
          }
        }
      });
    });
  });
});







//Create Tools object
fs.readdir(tools, function (err, files) {
  if (err) {
    throw err;
  }
  var itemsProcesseds = 0;
  var objs = {};
  objs.name = "tools";
  objs.list = [];
  files.forEach(file => {


    if (path.extname(file) == ".html") {
      /* console.log(file); */
      objs.list.push(file);
      itemsProcesseds++;

      if (itemsProcesseds === files.filter(file => path.extname(file) == ".html").length) {
        tools_list.push(objs);
        //console.log(brands_list);
        toolsDir(files);
      }
    }
  });
});

function toolsDir(files) {
  files.map(function (file) {
    return path.join(tools, file);
  }).filter(function (file) {
    return fs.statSync(file).isDirectory();
  }).forEach(function (file) {
    /* console.log(file); */
    var temp = file.replace('public\\tools\\', '');
    fs.readdir(tools + "/" + temp, (err, files) => {
      var obj = {};
      obj.name = temp;
      obj.list = [];
      var itemsProcessed = 0;
      files.forEach(file => {
        if (path.extname(file) == ".html") {
          obj.list.push(file);
          itemsProcessed++;
          if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length) {
            tools_list.push(obj);
            /* console.log(tools_list); */
          }
        }
      });
    });
  });
}



fs.readdir(other, function (err, files) {
  if (err) {
    throw err;
  }



  files.map(function (file) {
    return path.join(other, file);
  }).filter(function (file) {
    return fs.statSync(file).isDirectory();
  }).forEach(function (file) {

    var temp = file.replace('public\\other\\', '');
    fs.readdir(other + "/" + temp, (err, files) => {
      var obj = {};
      obj.name = temp;
      obj.list = [];
      var itemsProcessed = 0;
      files.forEach(file => {
        if (path.extname(file) == ".html" || path.extname(file) == ".pdf") {
          obj.list.push(file);
          itemsProcessed++;
          if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length || itemsProcessed === files.filter(file => path.extname(file) == ".pdf").length) {
            other_list.push(obj);
            // console.log(other_list);
          }
        }
      });
    });
  });
});






/* --------------Page Render Routes----------------------- */

//Home
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/user/login", function (req, res) {
  res.render("user", { title: "User Login", content: "login" });

});

app.get("/user/register", function (req, res) {

  res.render("user", { title: "New Registration", content: "register" });

});

app.use(requireLogin);

function requireLogin(req, res, next) {
  if (!req.user) {
    //console.log("call")
    res.clearCookie('session');
    res.redirect('/user/login');
  } else {
    next();
  }
};
app.get("/dashboard", function (req, res) {
  res.render("dashboard/index", { brands_folder: brands_list, safezone_folder: safezone_list, tools_folder: tools_list, other: other_list, courses_folder: courses_list, content: 'dashboard' });
});

app.get("/dashboard/brands/:name", function (req, res) {
  res.render("dashboard/index", { brands_folder: brands_list, safezone_folder: safezone_list, tools_folder: tools_list, other: other_list, courses_folder: courses_list, content: 'dashboard', which: req.params.name });
});
app.get("/dashboard/safe-zone/:name", function (req, res) {
  res.render("dashboard/index", { brands_folder: brands_list, safezone_folder: safezone_list, tools_folder: tools_list, other: other_list, courses_folder: courses_list, content: 'dashboard', safe: req.params.name + "safe" });
});
app.get("/dashboard/tools/:name", function (req, res) {
  res.render("dashboard/index", { brands_folder: brands_list, safezone_folder: safezone_list, tools_folder: tools_list, other: other_list, courses_folder: courses_list, content: 'dashboard', which: req.params.name });
});
app.get("/dashboard/scope", function (req, res) {
  res.render("dashboard/index", { brands_folder: brands_list, safezone_folder: safezone_list, tools_folder: tools_list, other: other_list, courses_folder: courses_list, content: 'dashboard', inout: true });
});
app.get("/sem", function (req, res) {
  sb.sem(sem, function (vl) {

    res.render("sem/index", { sem: vl, content: 'dashboard' });
  });
});

app.get("/seo", function (req, res) {
  sb.seo(seo, function (vl) {
    /* console.log(vl);
     */
    res.render("seo/index", { seo: vl, content: 'dashboard' });
  });
});
app.get("/campaign", function (req, res) {
  sb.campaign(campaign, function (vl) {
    res.render("campaign/index", { campaign: vl, content: 'dashboard' });
  });

});

//Render PDF view
app.get("/dashboard/view_file/:dir/:filename", function (req, res) {
  res.render("dashboard/partials/preview_files", { brands_folder: brands_list, safezone_folder: safezone_list, content: 'preview_files', file_url: "/get/view_file/" + req.params.dir + "/" + req.params.filename });
});

//Load PDF in PDF View
app.get("/get/view_file/:dir/:filename", function (req, response) {
  var tempFile = "./public/" + req.params.dir + "/" + req.params.filename;
  fs.readFile(tempFile, function (err, data) {
    response.contentType("application/pdf");
    response.send(data);
  });
});

//Render Brands Components
app.get("/brands/:dir/:filename", function (req, res) {
  res.render("dashboard/brands/" + req.params.dir + "/" + req.params.filename);

});

//Render Tools Components
app.get("/tools/:dir/:filename", function (req, res) {
  res.render("dashboard/tools/" + req.params.dir + "/" + req.params.filename);

});

app.get("/tools/:filename", function (req, res) {
  res.render("dashboard/" + req.params.filename);

});


app.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/user/login');
});

app.get('*', function (req, res) {
  res.render("error/404");
});

// Server Listener 
app.listen(port, function () {
  console.log("Server listening on port " + port + "..");
});
