// this file is self contained -> so it is going to connec to mongoose and model

const mongoose = require('mongoose');
const Climbspot = require('../models/climbspot');
const cities = require('./cities'); // bringing in city array
const { places, descriptors } = require('./namingHelpers');
const climbspot = require('../models/climbspot');

mongoose.connect('mongodb://localhost:27017/climbOn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// function to return a random element from the array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Climbspot.deleteMany({}); // deletes everything
  //checking if it worked with big rock
  //   const c = new Climbspot({ title: 'big rock' });
  for (let i = 0; i < 50; i++) {
    // difficulty num
    const difficulty = Math.floor(Math.random() * 30) + 10;
    const random1000 = Math.floor(Math.random() * 1000); // random number will pick a city
    // makes new climbspot
    const climb = new Climbspot({
      location: `${cities[random1000].city}, ${cities[random1000].state}`, // get a city
      title: `${sample(descriptors)} ${sample(places)}`, // gives the place a name
      image: [{}],
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum magnam sed cumque recusandae quisquam temporibus corporis unde, minima tenetur est ducimus modi eos quos consectetur, beatae exercitationem quia libero quas.',
      difficulty,
    });
    await climb.save(); // save
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
