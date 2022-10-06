const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const generateRandomString = (length) => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;
  let res = '';

  for (let i = 0; i < length; i++) {
    res += characters.charAt(Math.floor(Math.random() * charLength));
  }
  
  return res;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const findUserByEmail = (email) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
      // we found our user!!
      return userToEmail;
    }
  }
  return false;
};

const findPasswordByEmail = (email) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
      // we found our user!!
      return userToEmail.password;
    }
  }
  return false;
};

const findUserIDByEmail = (email) => {
  for (const user in users) {
    const userToEmail = users[user];
    if (userToEmail.email === email) { 
      // we found our user!!
      return userToEmail.id;
    }
  }
  return false;
};

const cookieParser = require('cookie-parser');
const { restart } = require("nodemon");
app.use(cookieParser());

// Get /urls

app.get("/register", (req, res) => {
  const templateVars = { 
    user: findUserByEmail(req.cookies.email)
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user: findUserByEmail(req.cookies.email)
  };
  res.render("urls_login", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: findUserByEmail(req.cookies.email)
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: findUserByEmail(req.cookies.email)
  };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    user: findUserByEmail(req.cookies.email),
  };
  res.render("urls_show", templateVars);
});
// app.get("/urls/:id", (req, res) => {
//   const longURL = urlDatabase[req.params.id]
//   res.redirect(longURL);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });


// app.post 

app.post('/login', function (req, res) {
  if(!findUserByEmail(req.body.email) || findPasswordByEmail(req.body.email) !== req.body.password) {
    return res.status(403).send("You do not have access!");
  };
  if(findPasswordByEmail(req.body.email) === req.body.password) {
    res.cookie('email', req.body.email);
    res.cookie('userID', findUserIDByEmail(req.body.email));
    res.redirect("/urls");
  }
});

app.post('/logout', function (req, res) {
  res.clearCookie('email', req.body.email);
  res.redirect("/urls");
});

app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("You need to enter a valid email and password!");
  };
  if (findUserByEmail(req.body.email)) {
    return res.status(400).send("Your email has been registered! Please enter another email add to resgiter!")
  };
  const id = generateRandomString(6);
  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('email', users[id].email);
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  console.log("req.body", req.body); // Log the POST request body to the console
  const shortUrl = generateRandomString(6);
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longUrl;
  res.redirect("/urls");
});

// app.listen

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
