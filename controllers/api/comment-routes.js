const router = require('express').Router();
const {Comment} = require('../../models');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a comment
router.post('/', (req, res) => {
    // expects {content: 'comment text', user_id: 1, post_id: 1}
    Comment.create({
        content: req.body.content,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a comment
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: `No comment found with id ${req.params.id}!`});
            return;
        }
        res.json({message: `Deleted comment with id ${req.params.id}!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;