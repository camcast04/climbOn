const express = require('express');
const router = express.Router();
const climbspots = require('../controllers/climbspots');
const wrapAsync = require('../helpers/wrapAsync');
const Climbspot = require('../models/climbspot');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const {
  isLoggedIn,
  isAuthor,
  validateClimbspot,
} = require('../config/middleware/middleware');
// const Review = require('../models/review');

router.get('/', wrapAsync(climbspots.index));

// form to create new climbspots
router.get('/new', isLoggedIn, climbspots.renderNewForm);

//payload from form (req.body)
router.post(
  '/',
  isLoggedIn,
  upload.array('image'),
  validateClimbspot,
  climbspots.createClimbSpot
);

// showing climbspot
router.get('/:id', wrapAsync(climbspots.showClimbspot));

//route that serves the form
// we need to look up the thing we are editing so we can pre-populate the form
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  wrapAsync(climbspots.renderEditForm)
);

//update
router.put('/:id', wrapAsync(climbspots.updateClimbspot));

//delete
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  wrapAsync(climbspots.deleteClimbspot)
);

module.exports = router;
