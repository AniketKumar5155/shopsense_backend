const crypto = require("crypto");

const cryptData = (data) => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
};

module.exports = cryptData;