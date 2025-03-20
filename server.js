const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' }
];


app.get('/books', authenToken, (req, res) => {
    res.json({ status: 'Success', data: books });
});

function authenToken(req, res, next) {
    // Lấy header với key 'authorization'
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return res.sendStatus(401);

    // Lấy token từ header. Định dạng: "Bearer <token>"
    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(err, data);
        if (err) return res.sendStatus(403);
        req.data = data;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
