// Basic setup
const express = require("express");
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8080; // default port 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieSession = require('cookie-session');
const { restart } = require("nodemon");
app.use(cookieSession({
  name: 'whateverIwant',
  keys: ['secret']
}));

const {
  findUserByEmail,
  findshortURLByID,
  findPasswordByEmail,
  findUserIDByEmail,
  findAllURLbyEmail,
  generateRandomString,
  finduserIDByshortURL,
  users,
  urlDatabase,
} = require('./helpers');


// Get /resgiter /login /urls /urls/new /urls/:id /urls.json

// GET /register (if user logged in, redirect; otherwise return register page)
app.get("/", (req, res) => {
  if (findUserByEmail(req.session.email)) {
    res.redirect("/urls");
  } else {
    res.redirect ("/login");
  }
});

app.get("/register", (req, res) => {
  if (findUserByEmail(req.session.email)) {
    res.redirect("/urls");
  } else {
    const templateVars = { 
      user: findUserByEmail(req.session.email, users),
    };
    res.render("urls_register", templateVars);
  }
});

// GET /login (if user logged in, redirect to /urls; otherwise return to login page)
app.get("/login", (req, res) => {
  const templateVars = { 
    user: findUserByEmail(req.session.email, users),
    urls: findAllURLbyEmail(req.session.email, users, urlDatabase)
  };
  if (findUserByEmail(req.session.email, users)) {
    res.redirect("/urls");
  } else {
    res.render("urls_login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: findAllURLbyEmail(req.session.email, users, urlDatabase),
    user: findUserByEmail(req.session.email, users)
  };
  res.render("urls_index", templateVars);
});

//GST /urls/new  (if user not logged in, redirect; otherwise go to /new page)
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: findUserByEmail(req.session.email, users),
    urls: findAllURLbyEmail(req.session.email, users, urlDatabase)
  };
  if(!req.session.email) {
    res.redirect ("/login");
  } else {
  res.render("urls_new", templateVars);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET /urls/:id (only user logged in and has the access to the shortURL; otherwise return error message)
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    urls: findAllURLbyEmail(req.session.email, users, urlDatabase), 
    user: findUserByEmail(req.session.email, users),
  };
  if (!findshortURLByID(req.params.id, urlDatabase)) {
    return res.status(400).send("You need to enter a valid shortenURL!");
  } else if (!findUserByEmail(req.session.email, users)) { 
    return res.status(400).send("You are not logged in!");
  } else if (finduserIDByshortURL(req.params.id, urlDatabase) !== findUserByEmail(req.session.email, users).id) {
    return res.status(400).send("You do not have access to this shortURL!");
  }
  else {
  res.render("urls_show", templateVars);
  }
});

app.get("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// GET /u/:id
app.get("/u/:id", (req, res) => {
  const shortUrlId = req.params.id;
  const longURL = urlDatabase[shortUrlId]['longURL'];
  res.redirect(longURL);

});

// POST /login if(pw and email match, redirect /urls; otherwise return error)
app.post('/login', function (req, res) {
  if(!findUserByEmail(req.body.email, users) || !bcrypt.compareSync(req.body.password, findPasswordByEmail(req.body.email, users))) {
    return res.status(403).send("You do not have access!");
  }
  if(bcrypt.compareSync(req.body.password, findPasswordByEmail(req.body.email, users))) {
    req.session.email = req.body.email;
    req.session.userID = findUserIDByEmail(req.body.email, users);
    res.redirect("/urls");
  }
});


// logout: delete cookies and redirect to urls
app.post('/logout', function (req, res) {
  req.session = null;
  res.redirect("/urls");
});

// POST /register (if email/pw empty or email exists, return error; otherwise create the account(id, email, pw), cookie, and redirect)
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("You need to enter a valid email and password!");
  }
  if (findUserByEmail(req.body.email, users)) {
    return res.status(400).send("Your email has been registered! Please enter another email add to resgiter!")
  }
  const id = generateRandomString(6);
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id: id,
    email: req.body.email,
    password: hashedPassword,
  };
  req.session.email = req.body.email;
  res.redirect("/urls");
})

// POST /urls add the new shortURL and longURL and redirect
app.post("/urls", (req, res) => {
  if (!req.session.email) {
    return res.send("you need to login first!")
  } else {
  const shortUrl = generateRandomString(6);
  urlDatabase[shortUrl] = {
    "longURL": req.body.longURL,
    "userID": findUserIDByEmail(req.session.email, users)
  }
  res.redirect(`/urls/${shortUrl}`);
  }
});

app.post("/urls/:id/delete", (req, res) => { 
    const id = req.params.id;
    delete urlDatabase[id];
    res.redirect("/urls");
});


// POST /urls edit the new shortURL and redirect
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = {
    "longURL": req.body.longURL,
    "userID": findUserIDByEmail(req.session.email, users)
  };
  res.redirect("/urls");
});

// app.listen

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
