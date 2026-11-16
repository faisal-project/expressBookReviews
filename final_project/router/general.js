const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({
                "username": username,
                "password": password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let bookKeys = Object.keys(books);
    let result = {};

    bookKeys.forEach((key) => {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    });

    return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let bookKeys = Object.keys(books);
    let result = {};

    bookKeys.forEach((key) => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });

    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

// Task 10: Get all books using async-await with Axios
const getAllBooks = async () => {
    try {
        const response = await axios.get(
            'http://localhost:5000/'
        );

        console.log("All books:");
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error("Error retrieving all books:", error.message);
        throw error;
    }
};


// Task 11: Get book details by ISBN using Promises with Axios
const getBooksByISBN = (isbn) => {
    return axios
        .get(`http://localhost:5000/isbn/${encodeURIComponent(isbn)}`)
        .then((response) => {
            console.log(`Book with ISBN ${isbn}:`);
            console.log(response.data);

            return response.data;
        })
        .catch((error) => {
            console.error("Error retrieving book by ISBN:", error.message);
            throw error;
        });
};


// Task 12: Get books by author using async-await with Axios
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log(`Books by ${author}:`);
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error("Error retrieving books by author:", error.message);
        throw error;
    }
};


// Task 13: Get books by title using Promises with Axios
const getBooksByTitle = (title) => {
    return axios
        .get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        .then((response) => {
            console.log(`Books with title ${title}:`);
            console.log(response.data);

            return response.data;
        })
        .catch((error) => {
            console.error("Error retrieving books by title:", error.message);
            throw error;
        });
};

module.exports.general = public_users;
