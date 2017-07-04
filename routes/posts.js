var express = require('express');
var PostModel = require('../models/posts');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/',function (req,res,next) {
	var author = req.query.author;

	PostModel.getPosts(author)
		.then(function(posts){
			res.render('posts',{
				posts:posts
			});
		})
		.catch(next);
});

router.get('/create', checkLogin, function(req, res, next) {
  res.render('create');
});

router.post('/',checkLogin,function(req,res,next){
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	try {
		    if (!title.length) {
		      throw new Error('title is required');
		    }
		    if (!content.length) {
		      throw new Error('content is required');
		    }
	  	} catch (e) {
	    	req.flash('error', e.message);
	    	return res.redirect('back');
	  	}

	var post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	};

	PostModel.create(post)
		.then(function(result){
			post = result.ops[0];
			req.flash('success','post success');
			res.redirect(`/posts/${post._id}`);
		})
		.catch(next);
});

router.get('/:postId',function (req,res,next) {
	// get one post
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