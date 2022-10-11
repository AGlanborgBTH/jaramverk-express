require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser')
const cors = require("cors")
const morgan = require("morgan")

const app = express();
const httpServer = require("http").createServer(app)

const doc = require("./routes/docRoute");
const user = require("./routes/userRoute")

const port = process.env.PORT || 8082;

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const { logreq } = require("./middleware/logreq");

app.use(cors());
app.options('*', cors());
app.disable('x-powered-by');
app.use(express.json())
app.use(logreq);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

io.on('connection', function (socket) {
    console.log("User connected with socket id:", socket.id)

    documents = {}

    socket.on("doc", function (doc) {
        documents[doc.id] = doc

        socket.broadcast.emit("doc", doc)
    })

    socket.on("newDoc", function (doc) {
        console.log(documents)
        socket.emit("doc", documents[doc.id])
    })

    socket.on('disconnect', () => {
        console.log("User disconnected with socket id:", socket.id)
    });
});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`)
});

app.use("/doc", doc)
app.use("/user", user)

var server = httpServer.listen(port, function () {
    var host = server.address().address;
    console.log('App listening at', host, port)
});

module.exports = server
