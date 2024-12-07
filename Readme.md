# Task Management Backend System

## Overview
This project is a Task Management backend system built with Node.js, Express, and MongoDB. It includes role-based access control, task assignment functionality, authentication, and rate limiting. The backend also integrates Swagger UI for interactive API documentation and testing.

---

## Features Overview

### User Registration
- Users can sign up with a username, email, and password.
- Validates email format and enforces strong password criteria.
- Optional confirmation email upon registration.

### User Login
- Registered users can log in using their credentials.
- Validates credentials and issues a JWT token.
- Rate limiting to prevent brute-force attacks.

### User Logout
- Authenticated users can log out, invalidating their JWT token.

### Get User Profile
- Retrieves profile information for authenticated users, including username, email, and roles.
- Secured endpoint accessible only to logged-in users.

### Role-Based Access Control (RBAC)
- Defines roles (Admin, Manager, User) with varying access levels to endpoints.
- Enforces role-based restrictions for secure access.

### Task Management
- Supports CRUD operations for tasks:
  - Create, read, update, and delete tasks with relevant fields.
- Ensures tasks are associated with users and enforces access control.

### Task Assignment
- Allows managers to assign tasks to users within their team.
- Provides endpoints to view and update assigned tasks.

### Advanced Features
- **Rate Limiting:** Protects APIs from abuse by configuring limits based on user roles.
- **Search and Filtering:** Implements search and filtering for tasks based on criteria like status and priority.

### Additional Features
- Secure authentication with JWT tokens.
- Interactive API documentation via Swagger UI.
---

## Live Demo  
[Live Demo](https://node-swagger-task-psiborg.onrender.com/api-docs/) 

---

## Setup

## Environment Variables

To run this project locally, you will need to set up the following environment variables in your `.env` file:

### Required Environment Variables

### Database Configuration
- `DB` - Database name.
- `MONGO_URI` - MongoDB connection string.

### Server Configuration
- `PORT` - Port number where the server will run (default: `3000`).
- `SECRET` - Secret key for JWT token generation.

### Email Configuration
These variables are required for email services:
- `EMAIL_USER` - Email address used for sending emails (e.g., for password resets).
- `EMAIL_PASS` - App password or SMTP password for the email account.

### Prerequisites
- **Node.js:** Make sure you have [Node.js version 19 or above](https://nodejs.org/) installed.
- **MongoDB:** You need a MongoDB instance running, either locally or through a service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Installation

### Clone the Repository

```bash
git https://github.com/Ganesh-Patel/Node_Swagger_Task_PsiBorg.git
cd Node_Swagger_Task_PsiBorg
```
### Install Dependencies
```bash
npm install
# or
yarn install
```

### Run
```bash
node server.js
```

## Deployment  

- **Backend**: Hosted on **Render** for scalable and reliable API services.  
---

## Dependency Overview

### Dependencies

1. **bcryptjs** (`^2.4.3`)
   - Hashes passwords securely using the bcrypt algorithm for enhanced user authentication security.

2. **body-parser** (`^1.20.3`)
   - Parses incoming request bodies, making data available under the `req.body` property.

3. **cookie-parser** (`^1.4.7`)
   - Parses cookies attached to client requests, enabling easy access to cookie data.

4. **cors** (`^2.8.5`)
   - Enables Cross-Origin Resource Sharing (CORS) to accept requests from different domains.

5. **dotenv** (`^16.4.7`)
   - Loads environment variables from a `.env` file into `process.env` for configuration management.

6. **express** (`^4.21.1`)
   - A minimalist web framework for Node.js used to build web applications and APIs.

7. **express-rate-limit** (`^7.4.1`)
   - Limits repeated requests to public APIs and endpoints to prevent abuse and denial-of-service attacks.

8. **jsonwebtoken** (`^9.0.2`)
   - Implements JSON Web Tokens (JWT) for secure user authentication and information exchange.

9. **moment** (`^2.30.1`)
   - Parses, validates, manipulates, and formats dates and times in JavaScript applications.

10. **mongoose** (`^8.8.3`)
    - An ODM library for MongoDB and Node.js, providing a schema-based solution to model application data.

11. **nodemailer** (`^6.9.16`)
    - Sends emails from Node.js applications, supporting various transport methods including SMTP.

12. **swagger-autogen** (`^2.23.7`)
    - Automatically generates Swagger documentation based on your Express routes.

13. **swagger-ui-express** (`^5.0.1`)
    - Serves auto-generated Swagger UI documentation for your API, enabling interactive API exploration.

14. **validator** (`^13.12.0`)
    - Provides string validators and sanitizers to ensure data integrity by validating user inputs.

## Author  

**Ganesh Patel**  
[GitHub Profile](https://github.com/Ganesh-Patel)  

---

## License  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.  

---

© 2024 Task Management App  Platform. All rights reserved. 
