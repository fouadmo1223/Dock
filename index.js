const express = require("express");
const app = express();

const PORT = 3001;

app.get("/", (req, res) => {
  res.send(`
        <h2>Welcome To Node - Docker  demo </h2>
        `);
});

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT} `);
});
