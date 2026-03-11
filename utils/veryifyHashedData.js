const bcrypt = require('bcrypt')

const verifyHashedData = async (data, hashedData) => {
  try {
    return await bcrypt.compare(data, hashedData);
  } catch (error) {
    throw new Error('Verification error');
  }
};

module.exports = verifyHashedData;
