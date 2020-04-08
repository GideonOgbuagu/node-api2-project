const express = require("express");



const db = require("./data/db.js");


const server = express();

server.use(express.json())

// READ
server.get('/api/posts', (req, res) => {
    db.find(req.query)
    .then(posts => res.status(200).json({queryString: req.query, posts}))
    .catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved."})
    })
})

// CREATE
server.post('/api/posts', (req, res) => {
    console.log(req.body) 
    const post = req.body; // body of the data from the client
    db.insert(post)
      .then(idObj => db.findById(idObj.id))
      .then(post => {
          const { title, contents } = post;
        if(!title || !contents ) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            res.status(201).json(post);
        }     
      })
      .catch(err => {
          res.status(500).json({error: "There was an error while saving the post to the database" })
      })

})

//READ by Id
server.get('/api/posts/:id', (req, res) => {
    // const id = req.params.id;
    db.findById(req.params.id)
      .then((post) => {
          if(post){
            res.status(200).json(post)
          } else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
          }
      })
      .catch(error => {
          //log error to the database
         res.status(500).json({error: "The post information could not be retrieved." }) 
      })
})








server.listen(5555, () => {
    console.log("\n*** Server Running on http://localhost:5555 ***\n");
  });