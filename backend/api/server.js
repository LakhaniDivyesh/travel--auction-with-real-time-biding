require('dotenv').config();

var express = require('express');
var cors = require('cors');
let app = express();

// app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


//socket.io
const http = require("http").Server(app);
// const io = require("socket.io")(http);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    }
});

socketIO.on("connection", (socket) => {


    // socket.on('join_room', (data) => {
    //     const { room } = data;
    //     socket.join(room);

    // });

    socket.on("message", (msg) => {
        // socketIO.in(msg.package_id).emit('message', msg);
        // socket.broadcast.to(msg.socketID).emit("message", msg);
        socket.broadcast.emit("message", msg);
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
})

const api_document = require('./modules/v1/api_document/index');
app.use('/v1/api_document', api_document);

app.use('/public/images', express.static(__dirname + '/public/images'));
app.use('/', require('./middleware/validators').extractHeaderLanguage);
app.use('/', require('./middleware/validators').validateApiKey);
app.use('/', require('./middleware/validators').validateHeaderToken);
// app.use('/', require('./middleware/validators').decryption);




//user and organizer
var auth = require("./modules/v1/auth/route");
app.use('/api/v1/auth', auth);

var home = require("./modules/v1/home/route");
const message = require('./language/en');
app.use('/api/v1/home', home);


try {
    http.listen(process.env.PORT)
    console.log("Server⚡: " + process.env.PORT);
} catch (error) {
    console.log("failed" + error);
}