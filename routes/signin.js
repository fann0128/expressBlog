var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function(req,res,next){
	// sign in page
	res.render('signin');
});

router.post('/',checkNotLogin,function(req,res,next){
	var username = req.fields.name;
	var pwd = req.fields.password;

	UserModel.getUserByName(username)
		.then(function (user){
			if(!user)
			{
				req.flash('error','username does not exist');
				return res.redirect('back');
			}
			if(pwd.length === 0)
			{
				req.flash('error','password cannot be empty');
				return res.redirect('back');
			}
			if(sha1(pwd) !== user.password)
			{
				req.flash('error','password is not correct');
				return res.redirect('back');
			}
			req.flash('success','Sign in success');
			delete user.password;
			req.session.user = user;
			res.redirect('/posts');
		})
		.catch(next);
});

module.exports = router;