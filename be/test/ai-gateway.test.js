const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const env = require("../src/config/env");
const {
  validateImageFiles,
  buildSignedHeaders,
  dailyImageLimitFor,
} = require("../src/services/ai-gateway.service");

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64"
);

test("validateImageFiles chấp nhận ảnh PNG hợp lệ và từ chối file giả mạo", () => {
  assert.doesNotThrow(() => {
    validateImageFiles([{ mimetype: "image/png", buffer: TINY_PNG }]);
  });

  assert.throws(
    () => validateImageFiles([]),
    /1 đến 4 ảnh/
  );

  assert.throws(
    () => validateImageFiles([{ mimetype: "image/png", buffer: Buffer.from("not-a-real-png-data") }]),
    /không hợp lệ/
  );

  assert.throws(
    () => validateImageFiles([{ mimetype: "image/gif", buffer: TINY_PNG }]),
    /JPG, PNG hoặc WEBP/
  );
});

test("buildSignedHeaders tạo chữ ký HMAC-SHA256 khớp chuẩn với ai-service", () => {
  const rawBody = JSON.stringify({ user_id: "u1", images: [] });
  const headers = buildSignedHeaders("vision-inspect", "u1", rawBody);

  assert.equal(headers["x-internal-user-id"], "u1");
  assert.ok(headers["x-internal-timestamp"]);

  const digest = crypto.createHash("sha256").update(rawBody).digest("hex");
  const expected = crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`vision-inspect:u1:${headers["x-internal-timestamp"]}:${digest}`)
    .digest("hex");

  assert.equal(headers["x-internal-signature"], expected);
});

test("dailyImageLimitFor cấp hạn mức cao cho admin/moderator", () => {
  const userLimit = dailyImageLimitFor({ role: "user" });
  const adminLimit = dailyImageLimitFor({ role: "admin" });
  assert.ok(userLimit > 0);
  assert.ok(adminLimit > userLimit);
});
