const express = require("express");



const db = require("./data/db.js");

const server = express();



server.get('/api/posts', (req, res) => {
    db.find(req.query)
    .then(posts => res.status(200).json({queryString: req.query, posts}))
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved."})
    })
})

server.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    res.end()
})

server.listen(5555, () => {
    console.log("\n*** Server Running on http://localhost:5555 ***\n");
  });