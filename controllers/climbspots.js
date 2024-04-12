const Climbspot = require('../models/climbspot');
const climbspot = require('../models/climbspot');

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
  //saving
  await climbspot.save();
  res.redirect(`/climbspots/${climbspot._id}`);
};

module.exports.showClimbspot = async (req, res) => {
  //finding the climbspot by id
  const climbspot = await Climbspot.findById(req.params.id).populate('reviews');
  // res.render('climbspots/show', { climbspot });
  res.render('climbspots/show', { title: climbspot.title, climbspot });
};

module.exports.renderEditForm = async (req, res) => {
  // we need to look up a climbspot by that id
  const climbspot = await Climbspot.findById(req.params.id);
  // and then pass it to climbspots/edit
  // res.render('climbspots/edit', { climbspot });
  res.render('climbspots/edit', { title: 'Edit Climbspot', climbspot });
};

module.exports.updateClimbspot = async (req, res) => {
  const { id } = req.params;
  const climbspot = await Climbspot.findByIdAndUpdate(id, {
    ...req.body.climbspot,
  });
  res.redirect(`/climbspots/${climbspot._id}`);
};

module.exports.deleteClimbspot = async (req, res) => {
  const { id } = req.params;
  await Climbspot.findByIdAndDelete(id);
  res.redirect('/climbspots');
};
