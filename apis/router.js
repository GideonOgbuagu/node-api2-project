const express = require("express");

const db = require("../data/db");

const router = express.Router();

// READ
router.get('/', (req, res) => {
    db.find(req.query)
    .then(posts => res.status(200).json({queryString: req.query, posts}))
    .catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved."})
    })
})

// CREATE
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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

//UPDATE
router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
     // or this:  const { title, contents } = req.body; "count" below is the number of item updated
    const { id } = req.params;
    db.update(id, {title, contents}) // the second could be an object(json) or data in an object/json that we want to update 
      .then(count => { 
        if (count) {
            db.findById(id)
              .then(post => res.status(200).json(post))
              .catch(error => {
                  res.status(500).json({ error: "The post information could not be modified." })
              })
        } else if(!title || !contents ){
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      })
})


//DELETE
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
      .then((count => {
          if(count){
              res.status(200).json({ message: "post deleted"})
          } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." })
          }
      }))
      .catch(error => {
          res.status(500).json({ error: "The post could not be removed" })
      })
      
})


router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    db.findPostComments(id)
      .then(comments => {
          if(comments) {
              res.status(200).json(comments)
          } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." })
          }
      })
      .catch(error => {
          res.status(500).json({ error: "The comments information could not be retrieved." })
      })
})


// CREATE - insertComment()
router.post('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const { text } = req.body;
    db.insertComment({text, post_id})
      .then(comment_id => {
          db.findCommentById(comment_id.id)
            .then(([comment]) => {
                if(comment) {
                    res.status(201).json(comment)
                } else if(text === '') {
                    res.status(400).json({  errorMessage: "Please provide text for the comment." })
                } else {
                    res.status(404).json({message: "The post with the specified ID does not exist." })
                }
            })
        
      })
      .catch(error => {
          res.status(500).json({error: "There was an error while saving the comment to the database" })
      })
})


module.exports = router;