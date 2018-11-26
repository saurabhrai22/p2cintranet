
//Importing require module
var path = require("path");
const fs = require("fs");


//Folder Fetch Location variables
/* const safezone = "./files";
const brands = 'public/brands';
const tools = 'public/tools';
const sem_country = "public/sem";
const seo ="public/seo";
const campaign ="public/campaign";
const other ="public/other"; */

/* var safezone_list = [];
var brands_list = [];
var tools_list = [];



var other_list = []; */

module.exports = {
    seo: function (location, callback) {
        var seo_list = [];
        fs.readdir(location, function (err, files) {
            if (err) {
                throw err;
            }
            var obj = {};
            obj.name = "seo";

            obj.list = [];
            var itemsProcessed = 0;
            files.forEach(file => {
                if (path.extname(file) == ".html") {
                    obj.list.push(file);
                    itemsProcessed++;
                    if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length) {
                        seo_list.push(obj);
                        //console.log(seo_list);
                        //console.log(seo_list);
                        callback(seo_list);
                    }
                }
            });
        });
    },
    campaign: function (location, callback) {
        var campaign_list = [];
        fs.readdir(location, function (err, files) {
            if (err) {
                throw err;
            }

            files.map(function (file) {
                return path.join(location, file);
            }).filter(function (file) {
                return fs.statSync(file).isDirectory();
            }).forEach(function (file) {
                var countFolder = files.length;
                var temp = file.replace('public\\campaign\\', '');
                fs.readdir(location + "/" + temp, (err, files) => {


                    var obj = {};
                    obj.name = temp;
                    obj.list = [];
                    var itemsProcessed = 0;
                    files.forEach(file => {
                        if (path.extname(file) == ".html") {
                            obj.list.push(file);
                            itemsProcessed++;
                            if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length) {
                                campaign_list.push(obj);
                                if (countFolder == campaign_list.length) {
                                    callback(campaign_list);
                                }
                            }
                        }

                    });
                });
            });
        });
    },
    sem: function (location, callback) {
        var sem_list = [];
        fs.readdir(location, function (err, files) {
            var countFolder = files.length;
            if (err) {
                throw err;
            }

            files.map(function (file) {
                return path.join(location, file);
            }).filter(function (file) {
                return fs.statSync(file).isDirectory();
            }).forEach(function (file) {
                /* console.log(file); */

                var temp = file.replace('public\\sem\\', '');
                fs.readdir(location + "/" + temp, (err, files) => {
                    
                    if (files.length == 0) { countFolder--; };
                    if (countFolder == sem_list.length) {callback(sem_list);}

                    var obj = {};
                    obj.name = temp;
                    obj.list = [];
                    var itemsProcessed = 0;
                    files.forEach(file => {
                        if (path.extname(file) == ".html") {
                            obj.list.push(file);
                            itemsProcessed++;
                            if (itemsProcessed === files.filter(file => path.extname(file) == ".html").length) {
                                sem_list.push(obj);
                                // console.log(countFolder , sem_list.length);

                            }
                        }
                    });
                });
            });
        });
    }
}

