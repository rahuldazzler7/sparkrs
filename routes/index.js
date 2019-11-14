const express = require('express');
const router = express.Router();
const allposts = require('../models/Blogposts');
const multer = require('multer');
const path = require('path');
const blogpost = require('../models/Blogposts');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dz05jrtvq',
    api_key : '685172183328683',
    api_secret: 'kbwuCOCZ1wsTKMnGLWB6mhYccmM'
});

// function escapeRegex(text){
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"//$&");
// }  



//Set the storage engine
const storage = multer.diskStorage({
    //destination:"./public/createpost",
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
//res.render('addblog')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
router.get('/', (req,res)=>res.render('index'));
router.get('/home/createpost', ensureAuthenticated, (req,res)=>{
    
    res.render('addblog');
});
router.get('/home', ensureAuthenticated, (req,res)=>{
if(req.query.search){
    const letsearch = new RegExp(req.query.search, 'gi');
    allposts.find({$or:[{title: letsearch},{description: letsearch},{type:letsearch},{author:letsearch}]},(err,posts)=>{
        if(err){return console.log(err);}
        else{
            res.render('home',{aposts: posts});
        }
    });
}
else{
    allposts.find({}, (err,posts)=>{
        if(err) {console.log(err);}
        else{
            res.render(`home`,{ aposts: posts,
            });
        }
    });
}
});

router.patch('/home/')

router.post('/home/createpost/',ensureAuthenticated, upload ,(req,res)=>{

    

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
        

        cloudinary.uploader.upload(req.file.path, { folder:"sparkpost/posts" },(err, result)=>{
            if(err){console.log(err);}
            else{
                var postimgurl = result.secure_url;
                var postimg = postimgurl;     
                console.log(result);
                User.find(req.params.id)
                .then(postr=>{
                    if(postr){
                        const newPost = new blogpost ({
                            title, 
                            description, 
                            type,
                            postimg: postimg,
                            author: req.user.fullname,
                            _UserId: req.user.id
                            });
                            
                        newPost.save()
                        .then(newpost=>{
                            req.flash(`success_msg`,`Your post will be in feed within 1 miniute`);
                            res.redirect('/home');
                            
                        })
                        .catch(err=>console.log(err));
                    }
                    
                })
            }
        })

       
    }
  
});





module.exports = router;