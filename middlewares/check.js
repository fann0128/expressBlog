module.exports={
	checkLogin:function checkLogin(req,res,next){
		if(!req.session.user)
		{
			req.flash('error','not logged in');
			return res.redirect('/signin');
		}
		next();
	},
  	checkNotLogin: function checkNotLogin(req, res, next) {
	    if (req.session.user) {
	      req.flash('error', 'already sign in'); 
	      return res.redirect('back');
	    }
	    next();
  }
};