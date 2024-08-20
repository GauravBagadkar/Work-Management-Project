const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const port = process.env.PORT || 4000;

const dbConfig = require('./Config/dbConfig');

dbConfig.sequelize.sync({ force: false });

app.use(express.json());

//middleware that helps handle Cross-Origin Resource Sharing (CORS) in your Express application.
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
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type,Authorization');
    next();
});

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Work Management Project',
        version: '1.0.0',
        description: 'A description of your API',
    },
    servers: [
        {
            url: 'https://work-management-ashen.vercel.app/api', // Your server URL
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    // Path to the API docs
    apis: ['./swaggyRoute/*.js'], // files containing annotations as above
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const routes = require('./Routes/route');
app.use('/', routes);
//api
// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(400).json({ error: "Something broke!" });
});

app.listen(port, () => {
    console.log(`server has started, ${port}`);
});