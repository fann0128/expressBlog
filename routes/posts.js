var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/',function (req,res,next) {
	res.render('posts');
});

router.get('/:postId',function (req,res,next) {
	// get one post
	res.send(req.flash());
});

router.get('/create',function (req,res,next) {
	// get create page
	res.send(req.flash());
});

router.post('/',function(req,res,next){
	res.send(req.flash());
});

router.get('/:postId/edit',function(req,res,next){
	res.send(req.flash());
});

router.post('/:postId/edit',function(req,res,next){
	res.send(req.flash());
});

router.get('/:postId/remove',function(req,res,next){
	res.send(req.flash());
});

router.post('/:postId/comment',function(req,res,next){
	res.send(req.flash());
});

router.get('/:postId/comment/:commentId/remove',function(req,res,next){
	res.send(req.flash());
});

module.exports = router;