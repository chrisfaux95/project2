// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  // HOME LINK
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/landing.html"))
  })

  // FIXING LINKS
  app.get("/members", (req, res) => {
    // If no user, send to signup
    if (!req.user) {
      res.redirect("/signup");
    } else {
      res.sendFile(path.join(__dirname, "../public/members.html"));
    }
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    } else {
      res.sendFile(path.join(__dirname, "../public/login.html"));
    }
  }); 

  app.get("/signup", (req, res) => {
    if (req.user) {
      res.redirect("/members");
    } else {
      res.sendFile(path.join(__dirname, "../public/signup.html"));
    }
    
  })

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page

  app.get("/landing", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/landing.html"));
  });

  app.get("/hold", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/hold.html"));  
  });

  app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/game.html"))
  })
  
  app.get("/members", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"))
  })

  app.get("/highscores", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/highscores.html"));
  })
};
