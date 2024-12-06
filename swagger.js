import swaggerAutogen from 'swagger-autogen';

// Output file where swagger spec will be generated
const outputFile = './swagger-output.json';

// The files where your route handlers are defined
const endpointsFiles = ['./routes/userRoutes.js', './server.js']; // Adjust the routes file here

const doc = {
    info: {
        title: 'Task Management API',
        description: 'API for demonstrating user registration, login, and profile management',
        version: '1.0.0',
    },
    host: 'swagger-demo-a3rv.onrender.com',  // Change it to your live URL
    schemes: ['https'], // Adjust it to 'https' if using secure protocol
    basePath: '/api/users',
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'JWT authorization header',
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

// Generate swagger spec and output to a file
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated.');
});
