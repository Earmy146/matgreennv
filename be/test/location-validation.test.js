const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseAccuracy,
  parseCapturedAt,
  parseCoordinate,
  parsePositiveNumber,
} = require("../src/utils/location-validation");

test("accepts valid GeoJSON coordinate values", () => {
  assert.equal(parseCoordinate("21.0285", "Vĩ độ", -90, 90), 21.0285);
  assert.equal(parseCoordinate("105.8542", "Kinh độ", -180, 180), 105.8542);
});

test("rejects invalid coordinates and radius", () => {
  assert.throws(() => parseCoordinate(91, "Vĩ độ", -90, 90), /Vĩ độ không hợp lệ/);
  assert.throws(() => parseCoordinate(-181, "Kinh độ", -180, 180), /Kinh độ không hợp lệ/);
  assert.throws(() => parsePositiveNumber(0, "Bán kính"), /lớn hơn 0/);
});

test("rejects inaccurate GPS readings", () => {
  assert.equal(parseAccuracy(25), 25);
  assert.throws(() => parseAccuracy(5001), /quá thấp/);
});

test("accepts recent GPS timestamps and rejects stale timestamps", () => {
  const now = Date.now();
  assert.equal(parseCapturedAt(new Date(now - 60_000), now).getTime(), now - 60_000);
  assert.throws(() => parseCapturedAt(new Date(now - 16 * 60_000), now), /quá cũ/);
  assert.throws(() => parseCapturedAt(new Date(now + 61_000), now), /quá cũ/);
});
