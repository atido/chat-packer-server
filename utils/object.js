function verifyObjectComplete(obj) {
  return Object.values(obj).every((val) => val !== null);
}

module.exports = { verifyObjectComplete };
