const { assert } = require('chai');

const {
  findUserByEmail,
  findshortURLByID,
  findPasswordByEmail,
  findUserIDByEmail,
  findAllURLbyEmail,
  generateRandomString
} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

describe('findUserByEmail', function() {
  it('should return a user by valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(user.id, expectedUserID);
  });
});

