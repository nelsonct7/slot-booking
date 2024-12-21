const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const mongoose = require("mongoose");
const app = require("../App"); // Your main Express app
const Appointment = require("../models/Appointment");

chai.use(chaiHttp);

describe("Appointment API", () => {
  // Before running tests, connect to a test database
//   before(async () => {
//     const testDbUrl =
//       process.env.TEST_MONGODB_URI ||
//       "mongodb://localhost:27018/appointment_test";
//     await mongoose.connect(testDbUrl);
//   });

//   // Clear the database before each test
//   beforeEach(async () => {
//     await Appointment.deleteMany({});
//   });

//   // Close database connection after tests
//   after(async () => {
//     await mongoose.connection.close();
//   });

  describe("GET /api/slots/:date", () => {
    it("should return available slots for a given date", (done) => {
      const testDate = "2024-01-20";

      chai
        .request(app)
        .get(`/api/slots/${testDate}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("slots");
          expect(res.body.slots).to.be.an("array");

          // Verify slots format and lunch break exclusion
          res.body.slots.forEach((slot) => {
            expect(slot).to.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/);
            expect(slot).to.not.match(/^13:/); // No slots during lunch break
          });

          done();
        });
    });

    it("should handle invalid date format", (done) => {
      chai
        .request(app)
        .get("/api/slots/invalid-date")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });

  describe("POST /api/book", () => {
    it("should successfully book an available slot", (done) => {
      const appointment = {
        name: "John Doe",
        phoneNumber: "1234567890",
        date: "2024-01-20",
        timeSlot: "10:00",
      };

      chai
        .request(app)
        .post("/api/book")
        .send(appointment)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("name", appointment.name);
          expect(res.body).to.have.property(
            "phoneNumber",
            appointment.phoneNumber
          );
          expect(res.body).to.have.property("timeSlot", appointment.timeSlot);
          done();
        });
    });

    it("should prevent double booking of the same slot", (done) => {
      const appointment = {
        name: "John Doe",
        phoneNumber: "1234567890",
        date: "2024-01-20",
        timeSlot: "10:00",
      };

      // Book the slot first
      chai
        .request(app)
        .post("/api/book")
        .send(appointment)
        .end(() => {
          // Try to book the same slot again
          chai
            .request(app)
            .post("/api/book")
            .send(appointment)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.have.property(
                "error",
                "This slot is already booked"
              );
              done();
            });
        });
    });

    it("should reject booking with missing required fields", (done) => {
      const appointment = {
        name: "John Doe",
        // Missing phoneNumber
        date: "2024-01-20",
        timeSlot: "10:00",
      };

      chai
        .request(app)
        .post("/api/book")
        .send(appointment)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.include("Required fields are missing");
          done();
        });
    });
  });
});
