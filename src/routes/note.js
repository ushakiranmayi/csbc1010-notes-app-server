const { text } = require('express')
const express = require('express')
const { now } = require('mongoose')
const router = express.Router()
const { validateNote } = require('../utils/validators')

/* ------------------------ TODO-4 - Create New Note ------------------------ */
router.post('/', (req, res) => {
  console.log(`[POST] http://localhost:${global.port}/note - Storing a new note`)

  /*
  	TODO-4:
  		Given node content
  		Create a new node and store the node to the database,
  		Return the newly created note object

  		Note content is stored in variable newText

  		Your return object should be something similar to this:
      	{ id, text, dateCreated, lastModified }
  */

    // Your code here...

    // Define variables

  const newText = req.body.text;
  const dateCreated = new Date();
  const lastModified = new now();

  // insert new note

     db.query(`insert into notes (text, dateCreated, lastModified) VALUES (?, ?, ?)`, [newText, dateCreated, lastModified], function(err, result, fields) {

    // Upon fail, run the following line to respond with an error
    if (err) {   
  // --- begin of fail flow ---       
      console.log(err.message);
      res.status(500).send('Fail to insert');
    }
    // --- end of fail flow ---

    else{
      db.query(`SELECT * FROM notes WHERE id = ?`, result.insertId, function(err, rr) {

        if (err) {

          console.log(err.message);
          res.status(500).send('Fail to query');

        }else{
          const newNote = {id:rr[0].id, text:rr[0].text, dateCreated: rr[0].dateCreated, lastModified:rr[0].lastModified}; // this is the response object, make sure to replace with actual value

          // Upon succ, run the following lines to validate the response object and respond to client

          // --- begin of succ flow ---
          if (!validateNote(newNote)) {
            res.status(500).send('Invalid data type')
          }
          res.status(201).send({newNote})
          // --- end of succ flow ---
        }
      })
    }     

})
})
/* -------------------------------------------------------------------------- */

/* ------------------------- TODO-5 - Update A Note ------------------------- */
router.put('/', (req, res) => {
  console.log(`[PUT] http://localhost:${global.port}/note - Updating note`)

  /*
		TODO-5:
			Given note id and content
			Update the note's content with the given id in the database
			Return the updated note object

			Note id is stored in variable noteId
			Note content is stored in variable newText

			Your return object should be something similar to this:
        { id, text, dateCreated, lastModified }
	*/
	const noteId = req.body.id;
	const newText = req.body.text;
  const lastModified = new now();


  // You code here...
		
  // query for update text based on ID
  db.query(`update notes set text = ?, lastModified = ? where id = ?`, [newText, lastModified, noteId], function(err, result){
    
    if (err) {

      // Upon fail, run the following lines to respond with an error
      console.log(err);
      // --- begin of fail flow ---
      res.status(500).send('Fail to update')
      // --- end of fail flow ---

    }else{
      
      // query for getting updated details of that ID
      db.query(`select * from notes WHERE id = ?`, noteId, function(err, rr) {

        if (err) {

          console.log(err.message);
          res.status(500).send('Fail to query');

        }else{
          
          // Upon succ, run the following lines to validate the response object and respond to client

          // defining response object
          const updatedNote = {id: rr[0].id, text: rr[0].text, dateCreated: rr[0].dateCreated, lastModified: rr[0].lastModified};          

          // --- begin of succ flow ---
          if (!validateNote(updatedNote)) {
            res.status(500).send('Invalid data type');
          }else{
            res.send({ updatedNote });            
          }
          // --- end of succ flow ---

        }

      });

    }

  });

})

/* -------------------------------------------------------------------------- */

/* ------------------------- TODO-6 - Delete A Note ------------------------- */
router.delete('/', (req, res) => {
  console.log(`[DELETE] http://localhost:${global.port}/note - Deleting note`)

  /*
	  TODO-6:
      Given a note id
		  Delete note with the given id from the database

		  Note id is stored in variable noteId 
	*/
	const noteId = req.body.id

      // Your code here...

      db.query(`delete from notes where id = ?`, [noteId], function(err, result){
    
        if (err) {
    
          // Upon fail, run the following lines to respond with an error
          console.log(err);
          // --- begin of fail flow ---
          res.status(500).send('Fail to delete')
          // --- end of fail flow ---
    
        }
        else{

          // Upon succ, run the following lines to validate the response object and respond to client

          // --- begin of succ flow ---
          res.send()
          // --- end of succ flow ---
        } 
})
})
/* -------------------------------------------------------------------------- */

module.exports = router
