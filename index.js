const express = require("express");

const postsRouter = require("./apis/router.js")

const server = express();

server.use(express.json())

server.use('/api/posts', postsRouter)

//READ
server.get("/", (req, res) => {
    res.send(`
    <h2>Posts with Comments API</h>
    <p>Welcome to the Posts - Comments API</p>
  `);
})


server.listen(5555, () => {
    console.log("\n*** Server Running on http://localhost:5555 ***\n");
  });