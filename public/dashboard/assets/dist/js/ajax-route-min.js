function checkuser(e){$.ajax({type:"POST",data:{empid:e},url:"/hasuser",success:function(e,s){"exists"==e.toLowerCase()?(localStorage.setItem("empid",$("#employeeid").val()),window.open("/user/register","_self")):($("#loginmsg").css("display","block"),$("#loginmsg").text("Fields can't be empty"))},error:function(e,s){$("#loginmsg").css("display","block"),$("#loginmsg").text("Oops!! Something Went Wrong please try again")}})}function changepassword(e){$.ajax({type:"POST",data:{empid:localStorage.getItem("empid"),pass:e},url:"/changepassword",success:function(e,s){"succcessful"==e.toLowerCase()?(localStorage.clear(),window.open("/user/login","_self")):($("#registermsg").css("display","block"),$("#registermsg").text(e))},error:function(e,s){$("#registermsg").css("display","block"),$("#registermsg").text("Oops!! Something Went Wrong please try again")}})}$(document).ready(function(){$(".pdfload").click(function(e){e.preventDefault(),document.body.scrollTop=0,document.documentElement.scrollTop=0,$.ajax({url:$(this).attr("href"),success:function(e){$("#page-wrapper").html(e)}})}),$(".viewload").click(function(e){e.preventDefault(),document.body.scrollTop=0,document.documentElement.scrollTop=0,$.ajax({url:$(this).attr("href"),success:function(e){$("#page-wrapper").html(e)}})}),$("#inout").click(function(e){e.preventDefault(),document.body.scrollTop=0,document.documentElement.scrollTop=0,$.ajax({url:"/inout/inout.html",success:function(e){$("#page-wrapper").html(e)}})})}),$("#loginForm").submit(function(e){e.preventDefault();var s=new RegExp("^([A-Za-z0-9_\\-\\.])+@accenture.com$").test($("#employeeid").val());""==$("#employeeid").val()&&""==$("#textpassword").val()?($("#loginmsg").css("display","block"),$("#loginmsg").text("Fields can't be empty")):""!=$("#employeeid").val()&&""!=$("#textpassword").val()&&s?(console.log("login"),$.ajax({type:"POST",data:{empid:$("#employeeid").val(),pass:$("#textpassword").val()},url:"/login",success:function(e,s){"success"==e.toLowerCase()?window.open("/dashboard","_self"):($("#loginmsg").css("display","block"),$("#loginmsg").text("Authorization failed"))},error:function(e,s){$("#loginmsg").css("display","block"),$("#loginmsg").text("Oops!! Something Went Wrong please try again")}})):""!=$("#employeeid").val()&&""==$("#textpassword").val()&&s?checkuser($("#employeeid").val()):s?($("#loginmsg").css("display","block"),$("#loginmsg").text("Please verify the detail and try again")):($("#loginmsg").css("display","block"),$("#loginmsg").text("Accenture id is not valid"))}),"user/register"==window.location.href.split("/").slice(3,5).join("/")&&(null===localStorage.getItem("empid")?window.open("/user/login","_self"):$("#remail").text(localStorage.getItem("empid"))),$("#registerform").submit(function(e){e.preventDefault();var s=new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})");console.log($("#newpassword").val());var o=s.test($("#newpassword").val());console.log(o),o?$("#newpassword").val()===$("#confirmpassword").val()?changepassword($("#newpassword").val()):($("#registermsg").css("display","block"),$("#registermsg").text("Password Mismatch")):$("#passmsg").css("color","red")}),$("#logout").on("click",function(){window.open("/logout","_self")});