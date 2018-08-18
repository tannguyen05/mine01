var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 5000, function(){
    console.log("Server started...");
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", function(req, res){
    res.render("trangchu");
});

// Users array
var arr_users = [];

io.on("connection", function(socket){
    console.log(socket.id + " conect.");
    socket.on("Client-send-Username", function(data){
        if(arr_users.indexOf(data) >= 0){ //user already exists
            socket.emit("Server-send-fail");
        }
        else{   //new user
            socket.username = data; // add property to socket obj
            arr_users.push(data);
            socket.emit("Server-send-success", data);
            io.sockets.emit("Server-send-users", arr_users);  
        }
    });
    socket.on("logout", function(){
        arr_users.splice(arr_users.indexOf(socket.username), 1);
        socket.broadcast.emit("Server-send-users", arr_users);
    });

    socket.on("Client-send-message", function(data){
        io.sockets.emit("Server-send-message", {username: socket.username, content: data});
    });

    socket.on("Client-focusin", function(){
        console.log("focusin");
        socket.broadcast.emit("Server-send-focusin", socket.username);
    });
    socket.on("Client-focusout", function(){
        console.log("focusout");
        socket.broadcast.emit("Server-send-focusout");
    })

});