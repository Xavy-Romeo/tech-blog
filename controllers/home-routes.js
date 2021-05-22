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

module.exports = router;