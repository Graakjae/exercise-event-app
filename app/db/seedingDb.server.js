import mongoose from "mongoose";
export default async function seedDb() {
  // check if data exists
  const userCount = await mongoose.models.User.countDocuments();
  const eventCount = await mongoose.models.Event.countDocuments();

  if (userCount === 0 || eventCount === 0) {
    await insertData();
  }
}

async function insertData() {
  const User = mongoose.models.User;
  const Event = mongoose.models.Event;

  console.log("Dropping collections...");
  await User.collection.drop();
  await Event.collection.drop();

  console.log("Inserting data...");
  // Insert users
  const maria = await User.create({
    image:
      "https://www.baaa.dk/media/b5ahrlra/maria-louise-bendixen.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921650330000&format=webp",
    mail: "mlbe@eaaa.dk",
    name: "Maria Louise Bendixen",
    password: "maria1234",
  });

  const rasmus = await User.create({
    _id: new mongoose.Types.ObjectId("65cde4cb0d09cb615a23db17"),
    image: "https://share.cederdorff.dk/images/race.webp",
    mail: "race@eaaa.dk",
    name: "Rasmus Cederdorff",

    password: "rasmus1234",
  });

  const dan = await User.create({
    image:
      "https://www.eaaa.dk/media/bdojel41/dan-okkels-brendstrup.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921559630000&format=webp",
    mail: "dob@eaaa.dk",
    name: "Dan Okkels Brendstrup",
    password: "1234",
  });

  // Insert posts
  await Event.insertMany([
    {
      title: "Beautiful sunset at the beach",
      image:
        "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      user: maria._id,
      tags: ["beach", "sunset", "nature", "Aarhus"],
    },
    {
      title: "Exploring the city streets of Aarhus",
      image:
        "https://images.unsplash.com/photo-1559070169-a3077159ee16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      user: dan._id,
      tags: ["city", "Aarhus", "exploration"],
    },

    {
      title: "Exploring the city center of Aarhus",
      image:
        "https://images.unsplash.com/photo-1612624629424-ddde915d3dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      user: rasmus._id,
      tags: ["city", "Aarhus", "exploration", "cityhall"],
    },
  ]);
}
