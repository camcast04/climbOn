const express = require('express');
const router = express.Router();
const Climbspot = require('../models/climbspot');
const Review = require('../models/review');

router.get('/climbspots', async (req, res) => {
  // find all the climbspots (grab them)
  const climbspots = await climbspots.find({});
  // passing it through to template and render them
  res.render('climbspots/index', { climbspots });
});

// form to create new climbspots
router.get('/climbspots/new', (req, res) => {
  res.render('climbspots/new'); // rendering a form
});

//payload from form (req.body)
router.post('/climbspots', async (req, res) => {
  //creating a new climbspot
  const climbspot = new Climbspot(req.body.climbspot);
  //saving
  await climbspot.save();
  res.redirect(`/climbspots/${climbspot._id}`);
});

// showing climbspot
router.get('/climbspots/:id', async (req, res) => {
  //finding the climbspot by id
  const climbspot = await Climbspot.findById(req.params.id);
  res.render('climbspots/show', { climbspot });
});

//route that serves the form
// we need to look up the thing we are editing so we can pre-populate the form
router.get('/climbspots/:id/edit', async (req, res) => {
  // we need to look up a climbspot by that id
  const climbspot = await Climbspot.findById(req.params.id);
  // and then pass it to climbspots/edit
  res.render('climbspots/edit', { climbspot });
});

//update
router.put('/climbspots/:id', async (req, res) => {
  const { id } = req.params;
  const climbspot = await Climbspot.findByIdAndUpdate(id, {
    ...req.body.climbspot,
  });
  res.redirect(`/climbspots/${climbspot._id}`);
});

//delete
router.delete('/climbspots/:id', async (req, res) => {
  const { id } = req.params;
  await Climbspot.findByIdAndDelete(id);
  res.redirect('/climbspots');
});
