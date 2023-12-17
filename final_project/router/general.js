const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
//   return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Task 1
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books));
});

// Get book details based on ISBN
// Task 2
public_users.get('/isbn/:isbn',function (req, res) {
  const num = req.params.isbn;
  return res.status(300).send(JSON.stringify(books[num]));
 });
  
// Get book details based on author
// Task 3
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    for (const bookId in books) {
        if (books[bookId].author === author) {
            matchingBooks.push(books[bookId]);
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: 'No books found for the specified author' });
    }
});

// Get all books based on title
// Task 4
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    for (const bookId in books) {
        if (books[bookId].title === title) {
            matchingBooks.push(books[bookId]);
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: 'No books found for the specified title' });
    }
});

//  Get book review
// Task 5
public_users.get('/review/:isbn',function (req, res) {
    const num = req.params.isbn;
  return res.status(300).send(JSON.stringify(books[num].review));
});

module.exports.general = public_users;
