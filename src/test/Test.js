import { expect } from "chai";
import request from "supertest";
import app from "../../app.js";
import pkg from "pg";
const { DB_CONNECTION } = process.env;

describe("User Creation API", function () {
  let pool;

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

  it("should return status 201 and success message on successful user creation", function (done) {
    this.timeout(10000); // Set timeout to 10 seconds for this test
    request(app)
      .post("/api/auth/signin") // replace '/api/user' with your actual API endpoint for user creation
      .send({
        email: "ansh1@email.com",
        name: "Ansh",
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("status").equal("success");
        expect(res.body)
          .to.have.property("message")
          .equal("user created successfully");
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.have.property("id");
        expect(res.body.data)
          .to.have.property("email")
          .equal("ansh1@email.com");
        expect(res.body.data).to.have.property("name").equal("Ansh");
        // Add more assertions for data properties if needed
        expect(res.body.data).to.have.property("magic_link_token");
        expect(res.body.data).to.have.property("magic_link_expires");
        expect(res.body.data).to.have.property("created_at");
        expect(res.body.data).to.have.property("updated_at");
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
