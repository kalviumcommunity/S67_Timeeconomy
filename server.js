const express = require('express');
const app = express();
const port = 3000;


app.get('/ping', (req, res) => {
    res.send('Pong');
    }
);

app.listen(3000, () => {
    console.log(`Server is running on ${port}`);
    }
);
