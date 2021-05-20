const router = require('express').Router();
const User = require('../../models');

// Get all users
router.get('/', (req, res) => {
    User.findAll()
    .then(dbUserData => {
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get one user
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Add a user
router.post('/', (req, res) => {
    // expects: {username: 'Xavy', email: 'xavy@gmail.com', password: 'Password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update a user
router.put('/:id', (req, res) => {
    // expects: {username: 'Xavy', email: 'xavy@gmail.com', password: 'Password1234'}
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(async() => {
        const id = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!id) {
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }

        res.json({message: `Updated user with id ${req.params.id}!`, dbUserData: req.body});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id!'});
            return;
        }
        res.json({message: `Deleted user with id ${req.params.id}!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;