import { expect } from "chai";
import request from "supertest";
import app from "../../app.js";
import pkg from "pg";
const { DB_CONNECTION } = process.env;

describe("User Creation API", function () {
  let pool;
  let magicLinkUrl;
  let jwtToken;
  let userId;
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
    console.log("userId", userId);
    console.log("jwtToken", jwtToken);
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

  after(function (done) {
    // Close database connection after tests are done
    if (pool) {
      pool.end((err) => {
        if (err) {
          console.error("Database disconnection error:", err);
          done(err);
        } else {
          console.log("Database disconnected successfully");
          done();
        }
      });
    }
  });
});
