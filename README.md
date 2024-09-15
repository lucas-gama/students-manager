## Description

This project serves as a practical example to demonstrate the fundamentals and concepts of several technologies. It involves building a RESTful API to manage school operations, such as handling students, organizing classes, and enrolling students in those classes. The application is built with the NestJS framework and Sequelize for database management, and it runs on MySQL using a Docker container for easy setup and deployment.

Technologies used:

* NestJS for building the API.
* Sequelize for ORM and database management.
* Docker with MySQL for database containerization.

### Running

This example requires docker or a local MySQL installation.  If using a local MySQL database, see `src/database/config/database.ts` for credentials, and make sure there are matching credentials in the database and the source code.

#### Docker

There is a `docker-compose.yml` file for starting Docker.

```bash
$ docker-compose up
```

If you want to stop the Docker container, you can do it with

```bash
$ docker-compose down
```

## Project setup

#### Node version used: v22.8.0 

```bash
$ npm install

# Creating tables in the database (Docker container must be running)
$ npx sequelize-cli db:migrate

# Populating tables with some mock data
$ npx sequelize-cli db:seed:all

# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Swagger

While the application is running, open your browser and navigate to http://localhost:3000/api. You should see the Swagger UI with all existing routes, ready for testing.

## Docker Container

If you need to reset your database, access the docker command line of your container and follow these steps:

```bash
$ mysql -u root -p
```
When prompted, enter the password for the root user. The default password is "root", unless you have changed it.

```bash
$ USE challenge;

$ DROP DATABASE challenge;

$ CREATE DATABASE challenge;
```

Now that the database has been reset, you can re-run your migration and seed commands to set up your database schema and initial data.

## Future improvements

1. **Implement End-to-End (E2E) Tests**
   - Design and develop comprehensive E2E tests to ensure the entire application workflow functions as expected.

2. **Add Tests for Controllers**
   - Write unit tests for all controller methods to validate their behavior and error handling.
   - Ensure controllers correctly handle various input scenarios and produce the expected responses.

3. **Enhance Existing Unit Tests**
   - Review and improve existing unit tests to cover edge cases and additional scenarios.
   - Refactor tests for better readability, maintainability, and to ensure they align with updated application logic.

4. **Implement Filters and Paging for "findAll" Endpoints**
   - **Filters:** Add filtering options to the `findAll` endpoints to allow querying based on specific fields (e.g., name, status, date range).
   - **Paging:** Implement paging to manage large sets of results by specifying page number and page size.
   - **Integration:** Ensure that the filters and paging work together to return accurate and relevant results.
   - **Testing:** Write tests to validate that the filters and paging are applied correctly and handle edge cases effectively.

  
