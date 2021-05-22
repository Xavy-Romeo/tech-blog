const router = require('express').Router();
const {Comment} = require('../../models');
const withAuth = require('../../utils/withAuth');

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
router.post('/', withAuth, (req, res) => {
    // check if session exists
    if (req.session) {
        // expects {content: 'comment text', user_id: 1, post_id: 1}
        Comment.create({
            content: req.body.content,
            user_id: req.body.user_id,
            // use the id from the session
            post_id: req.session.post_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

// delete a comment
router.delete('/:id', withAuth, (req, res) => {
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