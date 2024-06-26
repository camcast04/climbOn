//controllers/climbspots

// Require the Climbspot model for database interactions
const Climbspot = require('../models/climbspot');
// import the Mapbox Geocoding API service
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../config/cloudinary');

// Route handler to display all climbing spots
module.exports.index = async (req, res) => {
  // find all the climbspots (grab them)
  const climbspots = await Climbspot.find({});
  // passing it through to template and render them
  res.render('climbspots/index', { climbspots });
};

// route handler to render the form for creating a new climbing spot
module.exports.renderNewForm = (req, res) => {
  res.render('climbspots/new'); // rendering a form
};

// route handler to create a new climbing spot
module.exports.createClimbSpot = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.climbspot.location,
      limit: 1,
    })
    .send();
  //creating a new climbspot
  const climbspot = new Climbspot(req.body.climbspot);
  climbspot.geometry = geoData.body.features[0].geometry;
  climbspot.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  climbspot.author = req.user._id;
  //saving
  await climbspot.save();
  req.flash('success', 'Successfully made a new climbing spot!');
  res.redirect(`/climbspots/${climbspot._id}`);
};

// Route handler to display a specific climbing spot
module.exports.showClimbspot = async (req, res) => {
  //finding the climbspot by id
  const climbspot = await Climbspot.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!climbspot) {
    req.flash('error', 'Cannot find that!');
    return res.redirect('/climbspots');
  }
  // res.render('climbspots/show', { climbspot });
  res.render('climbspots/show', { climbspot });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  // we need to look up a climbspot by that id
  const climbspot = await Climbspot.findById(id);
  if (!climbspot) {
    req.flash('error', 'Cannot find that!');
    return res.redirect('/climbspots');
  }
  // and then pass it to climbspots/edit
  // res.render('climbspots/edit', { climbspot });
  res.render('climbspots/edit', { climbspot });
};

module.exports.updateClimbspot = async (req, res) => {
  const { id } = req.params;
  try {
    const climbspot = await Climbspot.findByIdAndUpdate(
      id,
      req.body.climbspot,
      { new: true }
    );

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
      climbspot.images.push(...images);
      await climbspot.save();
    }

    // Remove selected images
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
        await climbspot.updateOne({
          $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
      }
    }

    req.flash('success', 'Successfully updated a climbing spot!');
    res.redirect(`/climbspots/${climbspot._id}`);
  } catch (error) {
    req.flash('error', 'Failed to update climbing spot!');
    res.redirect(`/climbspots/${id}/edit`);
  }
};

module.exports.deleteClimbspot = async (req, res) => {
  const { id } = req.params;
  await Climbspot.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a climbing spot!');
  res.redirect('/climbspots');
};
