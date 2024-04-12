const express = require('express');
const router = express.Router();
const climbspots = require('../controllers/climbspots');
const Climbspot = require('../models/climbspot');
const climbspot = require('../models/climbspot');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// const Review = require('../models/review');

router.get('/', climbspots.index);

// form to create new climbspots
router.get('/new', climbspots.renderNewForm);

//payload from form (req.body)
router.post('/', upload.array('image'), climbspots.createClimbSpot);

// showing climbspot
router.get('/:id', climbspots.showClimbspot);

//route that serves the form
// we need to look up the thing we are editing so we can pre-populate the form
router.get('/:id/edit', climbspots.renderEditForm);

//update
router.put('/:id', climbspots.updateClimbspot);

//delete
router.delete('/:id', climbspots.deleteClimbspot);

module.exports = router;
