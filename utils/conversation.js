const crypto = require('crypto');

function addContentToConversation(conversation, body, componentType) {
  return [...conversation, { body, component: componentType, id: crypto.randomUUID() }];
}

function isNull(value) {
  return value === null || value === 'null' || value === undefined || value === 'undefined';
}

function verifyObjectComplete(obj) {
  return Object.values(obj).every(val => !isNull(val));
}

module.exports = { addContentToConversation, verifyObjectComplete, isNull };
