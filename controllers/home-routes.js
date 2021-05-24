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
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// get a single post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'content', 'user_id', 'post_id', 'created_at', 'updated_at'],
                include: {  
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: `No post found with id: ${req.params.id}!`})
            return;
        }

        // serialize the data
        const post = dbPostData.get({plain: true});

        // pass data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
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

  router.get('/signup', (req, res) => {
    // check if logged in
    if (req.session.loggedIn) {
      // redirect to homepage
      res.redirect('/');
      return;
    }
    // redirect to login page if not logged in
    res.render('signup');
  });

module.exports = router;