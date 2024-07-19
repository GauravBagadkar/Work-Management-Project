const express = require('express');
const app = express();
port = 4000;

const dbConfig = require('./Config/dbConfig');
//const transporter = require('./Config/nodemailerConfig');
dbConfig.sequelize.sync({ force: false });

app.use(express.json());


const cors = require('cors');
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "*",
    exposedHeaders: ['authorization', 'x']
}
app.use(cors(corsOptions))

// Enable CORS for all requests
app.use(express.json())
app.use((req, res, next) => {
    // console.log(req);
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type,Authorization');
    next();
});
const routes = require('./Routes/route');
app.use('/', routes);
// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(400).json({ error: "Something broke!" });
});

app.listen(port, () => {
    console.log(`server has started, ${port}`);
});