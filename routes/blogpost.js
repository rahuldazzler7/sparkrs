const express = require('express');
const blogpost = require('../models/Blogposts')
const multer = require('multer');
const path = require('path');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Set the storage engine
const storage = multer.diskStorage({
    destination:"./public/createpost",
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage : storage,
    fileFilter: function(req, file, cb){
        checkfiletype(file, cb);
    }
}).single('postimg');

//check file type
function checkfiletype(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if( extname && mimetype){
        return cb(null, true);
    }else{
        cb('Images only');
    }
}

const router = express.Router();

router.get('/createpost', ensureAuthenticated, (req,res)=>res.render('addblog'));



router.post('/createpost', upload ,(req,res)=>{

    

    const {title, description, type} = req.body;
    let errors = [];
    if(!title || !description || !type ){
        errors.push({msg: `Please fill all the required fields`});
    }
    if(errors.length > 0){

        res.render(`addblog`,{
            errors,
            title,
            description,
            type,
        });
    }
    else{
        var postimg = req.file.filename;     
        console.log(req.file);
        const newPost = new blogpost ({
            title, 
            description, 
            type,
            postimg: postimg
            });
        newPost.save()
        .then(newpost=>{res.redirect('/');})
        .catch(err=>console.log(err));
        
        
         
    

    }
});

module.exports = router;