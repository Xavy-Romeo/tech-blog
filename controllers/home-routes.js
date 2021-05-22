const router = require('express').Router();
const {User, Post, Comment} = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
        include: [
            {
                // include comment model
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id', 'created_at', 'updated_at'],
                include: {  
                    model: User,
                    attributes: ['username']
                }
            },
            {
                // include username from User model
                model: User,
                attributes: ['username']
            }
        ],
        order: [['created_at', 'DESC']]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain: true}));
        res.render('homepage', {posts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/login', (req, res) => {
    // check if logged in
    if (req.session.loggedIn) {
      // redirect to homepage
      res.redirect('/');
      return;
    }
    // redirect to login page if not logged in
    res.render('login');
  });

module.exports = router;