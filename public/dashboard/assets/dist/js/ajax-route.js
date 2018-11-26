
//Pdf Preview viewer
$(document).ready(function() {
    $(".pdfload").click(function(event) {
        event.preventDefault();
        document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(result) {
                $("#page-wrapper").html(result);
            }
        });
    });

    $(".viewload").click(function(event) {
       
        event.preventDefault();
        document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
        $.ajax({
            url: $(this).attr('href'),
            success: function(result) {
                $("#page-wrapper").html(result);
            }
        });
    });
    $("#inout").click(function(event) {
        event.preventDefault();
        document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
        $.ajax({
            url: "/inout/inout.html",
            success: function(result) {
                $("#page-wrapper").html(result);
            }
        });
    });
});


/* api calls */
$("#loginForm").submit(function (e) {
    e.preventDefault();
    var patt = new RegExp('^([A-Za-z0-9_\\-\\.])+@accenture.com$');
    var res = patt.test($("#employeeid").val());
    /* console.log($("#employeeid").val()); */
    if ($("#employeeid").val() == "" && $("#textpassword").val() == "") {
        $("#loginmsg").css("display", "block");
        $("#loginmsg").text("Fields can't be empty");
    }
    else if ($("#employeeid").val() != "" && $("#textpassword").val() != "" && res) {
        console.log("login");
       
        $.ajax({
            type: 'POST',
            data: {
                "empid": $("#employeeid").val(),
                "pass": $("#textpassword").val()
            },
            url: '/login',
            success: function (data, status) {  

                if (data.toLowerCase() == "success") {
                    window.open("/dashboard", "_self");
                } else {
                    $("#loginmsg").css("display", "block");
                    $("#loginmsg").text("Authorization failed");
                }
            },
            error: function (data, status) {
                $("#loginmsg").css("display", "block");
                $("#loginmsg").text("Oops!! Something Went Wrong please try again");
            }
        });
    }
    else if ($("#employeeid").val() != "" && $("#textpassword").val() == "" && res) {
        checkuser($("#employeeid").val());
        
    }
    else if (!res){
        $("#loginmsg").css("display", "block");
                $("#loginmsg").text("Accenture id is not valid");
    }
    else {
        $("#loginmsg").css("display", "block");
        $("#loginmsg").text("Please verify the detail and try again");
    }
});

//console.log(window.location.href.split("/").slice(3,5).join("/")=="user/register");


function checkuser(user){
    $.ajax({
            type: 'POST',
            data: {
                "empid": user,
               
            },
            url: '/hasuser',
            success: function (data, status) {  
                if (data.toLowerCase() == "exists") {
                    localStorage.setItem("empid",$("#employeeid").val());
                    window.open("/user/register", "_self");
                } else {
                    $("#loginmsg").css("display", "block");
                    $("#loginmsg").text("Fields can't be empty");
                }
            },
            error: function (data, status) {
                $("#loginmsg").css("display", "block");
                $("#loginmsg").text("Oops!! Something Went Wrong please try again");
            }
        });
}
if(window.location.href.split("/").slice(3,5).join("/")=="user/register"){
    if(localStorage.getItem("empid")===null){
        window.open("/user/login", "_self");
    }
    else{
        $("#remail").text(localStorage.getItem("empid"))
    }
}

$("#registerform").submit(function(e){

    e.preventDefault();
    var patts = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})");
    console.log($("#newpassword").val());
    var passcheck = patts.test($("#newpassword").val());
    console.log(passcheck)
    if(passcheck){
        if($("#newpassword").val()===$("#confirmpassword").val()) {
            changepassword($("#newpassword").val());
        }
        else{
            $("#registermsg").css("display", "block");
        $("#registermsg").text("Password Mismatch");
        }
    }
    else{
        $("#passmsg").css("color","red");
    }
    
})

function changepassword(pass){
    $.ajax({
            type: 'POST',
            data: {
                "empid":localStorage.getItem("empid"),
                "pass": pass,
            },
            url: '/changepassword',
            success: function (data, status) {  
                if (data.toLowerCase() == "succcessful") {
                    localStorage.clear();
                    window.open("/user/login", "_self");
                } else {
                    $("#registermsg").css("display", "block");
                    $("#registermsg").text(data);
                }
            },
            error: function (data, status) {
                $("#registermsg").css("display", "block");
                $("#registermsg").text("Oops!! Something Went Wrong please try again");
            }
        });
}

$("#logout").on("click",function(){
    window.open("/logout", "_self");
})