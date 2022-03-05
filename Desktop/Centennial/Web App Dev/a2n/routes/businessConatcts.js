// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the businessContacts model
let businessContacts = require('../models/businessContacts');

// function to check if the user is authenticated
let requireAuth = (req, res, next) => {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

/* GET business contacts List page */
router.get('/', requireAuth, (req, res, next) => {
    // find all contacts in the businessContacts collection
    businessContacts.find({}).sort('contactName').exec(
        (err, businessContacts) => {
            if (err) {
                return console.error(err);
            }
            else {
                res.render('businessContacts/index', {
                    title: 'Business Contacts',
                    businessContacts: businessContacts,
                    displayName: req.user.displayName
                });
            }
        });
});

// GET the Business Contact Details page in order to edit an existing contact
router.get('/:id', requireAuth, (req, res, next) => {
    try {
        // get a reference to the id from the url
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        // find one businessContacts by its id
        businessContacts.findById(id, (err, businessContacts) => {
            if (err) {
                console.log(err);
                res.end(error);
            } else {
                // show the businessContacts details view
                res.render('businessContacts/update', {
                    title: 'Business Contact Details',
                    businessContacts: businessContacts,
                    displayName: req.user.displayName
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect('/error');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
    // id from URL
    let id = req.params.id;

    // instantiating a new businessContacts model based on form parameters
    let updatedBusinessContacts = businessContacts({
        "_id": id,
        "contactName": req.body.contactName,
        "contactNumber": req.body.contactNumber,
        "email": req.body.email
    });

    // updating a businessContacts document in database
    businessContacts.update({_id: id}, updatedBusinessContacts, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/businessContacts');
        }
    });
});

// GET - process the delete by business contact id
router.get('/delete/:id', requireAuth, (req, res, next) => {
    // id from URL
    let id = req.params.id;

    // removing businessContacts document from db
    businessContacts.remove({_id: id}, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/businessContacts');
        }
    });
});

module.exports = router;