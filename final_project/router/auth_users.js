const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}
// only registered users can login
// Task 7
regd_users.post("/login", (req, res) => {
    const username1 = req.body.username;
    const user = { username: username1 };
    const password = req.body.password;
    if (authenticatedUser(username1, password)) {
        console.log(username1, password);
        let accessToken = jwt.sign(user, 'access');
        req.session.authorization = { accessToken };
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.user.username;
    const num = req.params.isbn;
    const rev = { name: user, review: req.query.review };
    const existingReview = books[num].reviews.find(review => review.name === user);
    if (existingReview) {
        existingReview.review = req.query.review;
    } else {
        books[num].reviews.push(rev);
    }

    return res.status(300).json(books[num]);
});

// Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user1 = req.user.username;
    const num = req.params.isbn;
    books[num].reviews = books[num].reviews.filter(review => review.name !== user1)
    return res.status(300).json(books[num]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
