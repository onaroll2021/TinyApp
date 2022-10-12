const findUserByEmail = (email, users) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
      // we found our user!!
      return userToEmail;
    }
  }
  return false;
};

const findshortURLByID = (id, urlDatabase) => {
  for (const shortURL in urlDatabase) {
    if (shortURL === id) { 
      // we found our user!!
      return shortURL;
    }
  }
  return false;
};

const finduserIDByshortURL = (shortURL, urlDatabase) => {
  for (const shortUrl in urlDatabase) {
    const shortUrlObj = urlDatabase[shortUrl]
    if (shortUrl === shortURL) { 
      return shortUrlObj.userID;
    }
  }
  return false;
};

const findPasswordByEmail = (email, users) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
        // we found our user!!
        return userToEmail.password;
    }
  }
  return false;
};

const findUserIDByEmail = (email, users) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
      // we found our user!!
      return userToEmail.id;
    }
  }
  return false;
};

const findAllURLbyEmail = (email, users, urlDatabase) => { 
  const database = {};
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
        for(const shortUrl in urlDatabase) {
          const shortUrlId = urlDatabase[shortUrl];
          if (userToEmail.id === shortUrlId.userID) {
            database[shortUrl] = {
              ShortURL: shortUrl,
              LongURL:  shortUrlId.longURL
            }
          }
        }
    }
  }
  return database;
}

const generateRandomString = (length) => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;
  let res = '';

  for (let i = 0; i < length; i++) {
    res += characters.charAt(Math.floor(Math.random() * charLength));
  }
  
  return res;
};

const urlDatabase = {};
const users = {};

module.exports = {
  findUserByEmail,
  findshortURLByID,
  findPasswordByEmail,
  findUserIDByEmail,
  findAllURLbyEmail,
  generateRandomString,
  finduserIDByshortURL,
  users,
  urlDatabase,
};
