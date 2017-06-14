var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function(req,res,next) {
	// sign up page
	res.render('signup');
});

router.post('/',checkNotLogin,function(req,res,next) {
	var name = req.fields.name;
	var gender = req.fields.gender;
	var bio = req.fields.bio;
	var avatar = req.files.avatar.path.split(path.sep).pop();
	var password = req.fields.password;
	var repassword = req.fields.repassword;

	try {
		if (!(name.length >= 1 && name.length <= 10)) {
		  throw new Error('Name length between 1-10');
		}
		if (password.length < 6) {
		  throw new Error('Password minimal 6');
		}
		if (password !== repassword) {
		  throw new Error('Passwords are not match');
		}
		if (['m', 'f', 'x'].indexOf(gender) === -1) {
		  throw new Error('gender must be in m,f,x');
		}
		if (!req.files.avatar.name) {
		  throw new Error('Missing avatar');
		}
		if (!(bio.length >= 1 && bio.length <= 30)) {
		  throw new Error('Bio length between 1-10');
		}
	} catch (e) {
		// 注册失败，异步删除上传的头像
		fs.unlink(req.files.avatar.path);
		req.flash('error', e.message);
		return res.redirect('/signup');
	}

	// 明文密码加密
	password = sha1(password);

	// 待写入数据库的用户信息
	var user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio,
		avatar: avatar
	};
	// 用户信息写入数据库
	UserModel.create(user)
	.then(function (result) {
	  // 此 user 是插入 mongodb 后的值，包含 _id
	  user = result.ops[0];
	  // 将用户信息存入 session
	  delete user.password;
	  req.session.user = user;
	  // 写入 flash
	  req.flash('success', 'sign up success');
	  // 跳转到首页
	  res.redirect('/posts');
	})
	.catch(function (e) {
	  // 注册失败，异步删除上传的头像
	  fs.unlink(req.files.avatar.path);
	  // 用户名被占用则跳回注册页，而不是错误页
	  if (e.message.match('E11000 duplicate key')) {
	    req.flash('error', 'username is already exist');
	    return res.redirect('/signup');
	  }
	  next(e);
	});
});

module.exports = router;