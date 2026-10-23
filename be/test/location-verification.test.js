const test = require("node:test");
const assert = require("node:assert/strict");
const { classifyVerification } = require("../src/services/location-verification.service");

test("marks a location verified when geocoder distance is within GPS tolerance", () => {
  assert.equal(classifyVerification({ distanceKm: 0.8, accuracy: 30 }), "verified");
  assert.equal(classifyVerification({ distanceKm: 1.9, accuracy: 30 }), "verified");
});

test("flags a location when address and GPS are materially different", () => {
  assert.equal(classifyVerification({ distanceKm: 2.1, accuracy: 30 }), "flagged");
  assert.equal(classifyVerification({ distanceKm: 5, accuracy: 500 }), "flagged");
});
