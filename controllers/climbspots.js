//controllers/climbspots

const Climbspot = require('../models/climbspot');
// const climbspot = require('../models/climbspot');

module.exports.index = async (req, res) => {
  // find all the climbspots (grab them)
  const climbspots = await climbspot.find({});
  // passing it through to template and render them
  res.render('climbspots/index', { climbspots });
};

module.exports.renderNewForm = (req, res) => {
  res.render('climbspots/new'); // rendering a form
};

module.exports.createClimbSpot = async (req, res) => {
  //creating a new climbspot
  const climbspot = new Climbspot(req.body.climbspot);
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
  const climbspot = await Climbspot.findByIdAndUpdate(id, {
    ...req.body.climbspot,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  climbspot.images.push(...images);
  await climbspot.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await climbspot.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Successfully updated a climbing spot!');
  res.redirect(`/climbspots/${climbspot._id}`);
};

module.exports.deleteClimbspot = async (req, res) => {
  const { id } = req.params;
  await Climbspot.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a climbing spot!');
  res.redirect('/climbspots');
};
