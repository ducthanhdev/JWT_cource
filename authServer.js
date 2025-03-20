const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

let refreshTokens = [];

app.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({username: data.username}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5m'
        });
        res.json({ accessToken });
    });
});
app.post('/login', (req, res) => {
    const data = req.body; 
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    });
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshTokens });

});

app.post('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
