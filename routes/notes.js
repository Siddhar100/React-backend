const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const {body,validationResult} = require('express-validator');

router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    const notes = await Notes.find();
    res.json(notes);
})

router.post('/addnote',fetchuser,[
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Enter a valid email").isLength({min:5}),
    
],async (req,res)=>{
    try{
        const {title,description,tag} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const note = new Notes({
            title,description,tag,user:req.user.id
        });
        const saveNote = await note.save();
        res.json(saveNote);
    }catch(error){
        res.json({error:error.array()});
    }
    
})


router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const {title,description,tag} = req.body;
    try{
        let newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description=description};
        if(tag){newNote.tag = tag};
        let note =await Notes.findById(req.params.id);
        if(!note){
            return res.status(400).send("Not Found!");
        }
        if(note.user.toString() !== req.user.id){
            res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set : newNote},{new:true})
        res.json({note});
    }catch(error){
        res.status(500).send("internal Server Error!");
    }
    

})

router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    
    try{
        let note =await Notes.findById(req.params.id);
        if(!note){
            return res.status(400).send("Not Found!");
        }
        if(note.user.toString() !== req.user.id){
            res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"msg":"Note has been deleted!"});
    }catch(error){
        res.status(500).send("Internel Server error!");
    }
   
})

module.exports = router