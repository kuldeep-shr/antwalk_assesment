import { expect } from "chai";
import request from "supertest";
import app from "../../app.js";
import pkg from "pg";
const { DB_CONNECTION } = process.env;

describe("To-DO API Testing", function () {
  let pool;
  let magicLinkUrl;
  let jwtToken;
  let userId;
  let todoId;
  before(function (done) {
    // Increase the timeout for database connection setup
    this.timeout(10000); // Set timeout to 10 seconds
    // Establish database connection before running tests
    const connectionString = DB_CONNECTION;
    pool = new pkg.Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    pool.connect((err, client, release) => {
      if (err) {
        console.error("Database connection error:", err);
        done(err); // Pass error to Mocha to indicate failure
      } else {
        console.log("Database connected successfully");
        release(); // Release the client back to the pool
        done(); // Signal Mocha that setup is complete
      }
    });
  });

  /**
   * User Creation API Test Suite:
   * This test suite verifies the functionality of the user creation API endpoints.
   * It includes tests for user registration, magic link verification, and user information update.
   *
   * Test Setup:
   * - Establishes a database connection before running tests.
   * - Uses the provided DB_CONNECTION environment variable for database connection.
   *
   * Test Cases:
   * 1. should return status 201 and success message on successful user creation
   *    - Sends a POST request to /api/register endpoint with dummy user data.
   *    - Verifies the response status code, success message, and user data.
   *
   * 2. should verify magic link
   *    - Makes a GET request to the constructed magic link URL.
   *    - Verifies the response status code, success message, and JWT token.
   *
   * 3. should update user information successfully
   *    - Sends a PUT request to /api/users/:userId endpoint with updated user data.
   *    - Uses JWT token for authorization.
   *    - Verifies the response status code, success message, and updated user data.
   *
   * Test Environment:
   * - Uses Chai for assertions and Supertest for HTTP requests.
   * - Assumes the availability of the app.js file to import the Express app.
   *
   * Additional Notes:
   * - The database connection is established before all tests and closed after all tests are done.
   * - Each test case includes error handling and timeouts to ensure robustness.
   */

  it("should return status 201 and success message on successful user creation", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .post("/api/register")
      .send({
        email: "dummy@test.com",
        name: "Dummy",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal(
            "user created successfully and check your email for magic link"
          );
        expect(res.body).to.have.property("data");

        const userData = Array.isArray(res.body.data)
          ? res.body.data[0]
          : res.body.data;
        expect(userData).to.have.property("id").to.be.a("number");
        expect(userData).to.have.property("email").equal("dummy@test.com");
        expect(userData).to.have.property("name").equal("Dummy");
        expect(userData).to.have.property("created_at").to.be.a("string");
        expect(userData).to.have.property("updated_at").to.be.a("string");
        expect(userData).to.have.property("magic_link_url").to.be.a("string");
        userId = userData.id;
        magicLinkUrl = userData.magic_link_url;

        // Remove the hostname from magic_link_url and store in the global variable
        const urlParts = new URL(userData.magic_link_url);
        magicLinkUrl = `${urlParts.pathname}${urlParts.search}`;
        done();
      });
  });

  it("should verify magic link", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test

    // Make GET request to the constructed URL
    request(app)
      .get(magicLinkUrl)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal("magic link is correct");
        expect(res.body).to.have.property("data").to.be.an("array");
        expect(res.body.data[0]).to.have.property("jwt").to.be.a("string");
        jwtToken = res.body.data[0].jwt;
        done();
      });
  });

  it("should update user information successfully", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .put(`/api/users/${userId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        name: "Dum",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal("user updated successfully");
        expect(res.body).to.have.property("data").to.be.an("array");

        const userData = res.body.data[0];
        expect(userData).to.have.property("id").to.equal(userId);
        expect(userData).to.have.property("name").to.equal("Dum");
        expect(userData).to.have.property("email").to.equal("dummy@test.com");
        expect(userData).to.have.property("created_at").to.be.a("string");
        expect(userData).to.have.property("updated_at").to.be.a("string");

        done();
      });
  });

  /**
   * Todo API Test Suite:
   * This test suite verifies the functionality of the todo API endpoints, including creating, updating,
   * retrieving, listing, and deleting todos.
   *
   * Test Cases:
   * 1. should create todo successfully
   *    - Sends a POST request to /api/todo endpoint with todo data.
   *    - Verifies the response status code, success message, and todo data.
   *
   * 2. should update todo successfully
   *    - Sends a PUT request to /api/todo/:todoId endpoint with updated todo data.
   *    - Verifies the response status code, success message, and updated todo data.
   *
   * 3. should retrieve todo by ID successfully
   *    - Sends a GET request to /api/todo/:todoId endpoint.
   *    - Verifies the response status code, success message, and retrieved todo data.
   *
   * 4. should retrieve todo list successfully with query parameters
   *    - Sends a GET request to /api/todo endpoint with query parameters.
   *    - Verifies the response status code, success message, and todo list data.
   *    - Validates each todo in the response data array.
   *
   * 5. should delete todo successfully
   *    - Sends a DELETE request to /api/todo/:todoId endpoint.
   *    - Verifies the response status code, success message, and deleted todo data.
   *
   * Test Environment:
   * - Uses Chai for assertions and Supertest for HTTP requests.
   * - Assumes the availability of the app.js file to import the Express app.
   *
   * Additional Notes:
   * - Each test case includes error handling and timeouts to ensure robustness.
   */

  it("should create todo successfully", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .post("/api/todo")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        title: "Writing test case",
        description: "always write test case for better testing",
        status: "todo",
        priority: "high",
        due_date: "2024-10-31T18:30:00.000Z",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body).to.have.property("message").equal("todo is created");
        expect(res.body).to.have.property("data").to.be.an("array");

        const todoData = res.body.data[0];
        expect(todoData).to.have.property("todo_id").to.be.a("number");
        expect(todoData)
          .to.have.property("title")
          .to.equal("Writing test case");
        expect(todoData)
          .to.have.property("description")
          .to.equal("always write test case for better testing");
        expect(todoData).to.have.property("status").to.equal("todo");
        expect(todoData).to.have.property("priority").to.equal("high");
        expect(todoData).to.have.property("due_date");
        todoId = todoData.todo_id;
        done();
      });
  });

  it("should update todo successfully", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .put(`/api/todo/${todoId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({
        title: "Write Good Test Cases",
        due_date: "2024-12-01",
        status: "todo",
        priority: "medium",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal("todo is updated successfully");
        expect(res.body).to.have.property("data").to.be.an("array");

        const todoData = res.body.data[0];
        expect(todoData)
          .to.have.property("todo_id")
          .to.be.a("number")
          .equal(todoId);
        expect(todoData)
          .to.have.property("title")
          .to.equal("Write Good Test Cases");
        expect(todoData).to.have.property("description");
        expect(todoData).to.have.property("priority").to.equal("medium");
        expect(todoData).to.have.property("due_date").to.be.a("string");
        expect(todoData).to.have.property("status").to.equal("todo");
        expect(todoData).to.have.property("user_id").to.be.a("number");
        expect(todoData).to.have.property("created_at").to.be.a("string");
        expect(todoData).to.have.property("updated_at").to.be.a("string");

        done();
      });
  });

  it("should retrieve todo by ID successfully", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .get(`/api/todo/${todoId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body).to.have.property("message").equal("todo list");
        expect(res.body).to.have.property("data").to.be.an("array");

        const todoData = res.body.data[0];
        expect(todoData).to.have.property("todo_id").to.be.a("number");
        expect(todoData).to.have.property("user_id").to.be.a("number");
        expect(todoData).to.have.property("title").to.be.a("string");
        expect(todoData).to.have.property("description").to.be.a("string");
        expect(todoData).to.have.property("status").to.be.a("string");
        expect(todoData).to.have.property("priority").to.be.a("string");
        expect(todoData).to.have.property("due_date").to.be.a("string");
        expect(todoData).to.have.property("created_at").to.be.a("string");
        expect(todoData).to.have.property("updated_at").to.be.a("string");

        done();
      });
  });

  it("should retrieve todo list successfully with query parameters", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .get("/api/todo")
      .query({
        status: "inprogress|todo",
        priority: "high|medium|low",
        description: "a",
        page: 1,
        limit: 5,
        sortBy: "priority",
        sortDirection: "asc",
      })
      .set("Authorization", `Bearer ${jwtToken}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body).to.have.property("message").equal("todo list");
        expect(res.body)
          .to.have.property("data")
          .to.be.an("array")
          .of.length.above(0);

        // Validate each todo in the response data array
        res.body.data.forEach((todo) => {
          expect(todo).to.have.property("todo_id").to.be.a("number");
          expect(todo).to.have.property("user_id").to.be.a("number");
          expect(todo).to.have.property("title").to.be.a("string");
          expect(todo).to.have.property("description").to.be.a("string");
          expect(todo)
            .to.have.property("status")
            .to.be.oneOf([
              "todo",
              "inprogress",
              "completed",
              "onhold",
              "canceled",
              "pending",
              "review",
            ]);
          expect(todo)
            .to.have.property("priority")
            .to.be.oneOf(["high", "medium", "low"]);
          expect(todo).to.have.property("due_date").to.be.a("string");
          expect(todo).to.have.property("created_at").to.be.a("string");
          expect(todo).to.have.property("updated_at").to.be.a("string");
        });

        done();
      });
  });

  it("should delete todo successfully", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .delete(`/api/todo/${todoId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal("todo deleted successfully");
        expect(res.body).to.have.property("data").to.be.an("array");

        const deletedTodo = res.body.data[0];
        expect(deletedTodo).to.have.property("todo_id").to.be.a("number");
        expect(deletedTodo).to.have.property("user_id").to.be.a("number");
        expect(deletedTodo).to.have.property("title").to.be.a("string");
        expect(deletedTodo).to.have.property("description").to.be.a("string");
        expect(deletedTodo).to.have.property("status").to.be.a("string");
        expect(deletedTodo).to.have.property("priority").to.be.a("string");
        expect(deletedTodo).to.have.property("due_date").to.be.a("string");
        expect(deletedTodo).to.have.property("created_at").to.be.a("string");
        expect(deletedTodo).to.have.property("updated_at").to.be.a("string");

        done();
      });
  });

  after(function (done) {
    // Close database connection after tests are done
    if (pool) {
      pool.end((err) => {
        if (err) {
          console.error("Database disconnection error:", err);
          done(err);
        } else {
          console.log("Database disconnected successfully");
          process.exit(0);
        }
      });
    }
  });
});
