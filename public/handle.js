var socket = io.connect("http://localhost:5000")
document.getElementById("chatBox").style.display = "none";
document.getElementById("btnRegister").onclick = function(){
    socket.emit("Client-send-Username", document.getElementById("txtUname").value)
};
socket.on("Server-send-fail", function(){
    document.getElementById("err").innerHTML = "A user already exists, or the user was invalid.";
});
socket.on("Server-send-success", function(data){
    document.getElementById("currentUser").innerHTML = data;
    document.getElementById("chatBox").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
});

socket.on("Server-send-users", function(data){
    var list = document.getElementById("usersOnline");
    list.innerHTML = "";
    data.map(function(user){
        list.innerHTML += "<p class='user'>" + user + "</p>";
    });
});

document.getElementById("logout").onclick = function(){
    socket.emit("logout");
    document.getElementById("chatBox").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
};

document.getElementById("btnSend").onclick = function(){
    socket.emit("Client-send-message", document.getElementById("txtMess").value);
};

socket.on("Server-send-message", function(data){
    var mess = document.getElementById("message");
    mess.innerHTML += "<p class='txtMessage'>" + data.username + "&nbsp<label class='content'>"+data.content + "</label></p>"
    document.getElementById("txtMess").value = "";
});
document.getElementById("txtMess").onfocus = function(){
    socket.emit("Client-focusin");
};
document.getElementById("txtMess").onblur = function(){
    socket.emit("Client-focusout");
};

socket.on("Server-send-focusin", function(data){
    var focus = document.getElementById("focus");
    focus.innerHTML = data + ": " + "<img width='40px' src='ezgif.com-crop.gif'/>";
});
socket.on("Server-send-focusout", function(){
    document.getElementById("focus").innerHTML = "";
});



