const router = require('express').Router();
const {User, Post, Comment} = require('../../models');

// get all posts
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get one post
router.get('/:id', (req, res) => {
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
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a post
router.post('/', (req, res) => {
    // expects {title: 'Xavy is the best!', content: 'Xavy is the best! Yay!!!', user_id: 1} 
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// update a post
router.put('/:id', (req, res) => {
    // expects {title: 'Updated title'}
    // or {content: 'Updated content'}
    // or {title: 'Updated title', content: 'Updated content'}
    Post.update(
        // options that can be updated
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                id: req.params.id
            }
        }      
    )
    .then(async()  => {
        // find post with requested id
        const id = await Post.findOne({
            where: {
                id: req.params.id
            }
        });

        // if no post exists with requested id
        if (!id) {
            res.status(404).json({message: `No post found with id ${req.params.id}!`});
            return;
        }
        // if post with requested id exist then send updated response
        res.json({
            message: `Post with id: ${req.params.id} has been updated!`,
            post: {
                id: parseInt(req.params.id),
                update: req.body
            }            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });  
});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: `No post found with id: ${req.params.id}!`});
            return;
        }
        res.json({message: `Post with id: ${req.params.id} has been deleted!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;