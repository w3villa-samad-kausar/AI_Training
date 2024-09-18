const express = require('express');
const imageGenerator = require('./imageGenerator');
const bodyParser = require('body-parser');


const app = express();
const port = 3002;

app.use(bodyParser.json());


app.post('/image-generator',imageGenerator)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
