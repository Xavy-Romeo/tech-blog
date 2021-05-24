const router = require('express').Router();
const {User} = require('../../models');

// Get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
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
        attributes: {
            exclude: ['password']
        },
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
    .then(dbUserData => {
        // create session
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({user: dbUserData, message: 'You are now logged in!'});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// User login route
router.post('/login', (req, res) => {
    // expects: {email: 'xavy@gmail.com, username: '', password: 'Password1234'}
    // or {email: '', username: 'Xavy', password: 'Password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'No user found with that email address!'});
            return;
        }

        // verify user
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }

        // create session
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({user: dbUserData, message: 'You are now logged in!'});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// User logout route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        // end session
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// Update a user
router.put('/:id', (req, res) => {
    // expects: {username: 'Xavy', email: 'xavy@gmail.com', password: 'Password1234'}
    User.update(req.body, {
        individualHooks: true,
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