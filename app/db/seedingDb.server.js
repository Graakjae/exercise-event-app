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

  await Event.insertMany([
    {
      title: "Yoga and Meditation Workshop",
      description:
        "Join us for a relaxing session of yoga and meditation. Learn various yoga poses and meditation techniques to improve your physical and mental well-being.",
      date: new Date(),
      time: "9:00 AM",
      location: "Zen Garden Yoga Studio",
      image: "yoga.jpg",
      user: dan._id,
      tags: ["yoga", "meditation", "workshop"],
    },
    {
      title: "High-Intensity Interval Training (HIIT)",
      description:
        "Get ready for an intense workout session with our HIIT program. Burn calories, build endurance, and boost your metabolism with this high-energy workout.",
      date: new Date(),
      time: "6:00 PM",
      location: "FitZone Gym",
      image: "hiit.jpg",
      user: dan._id,
      tags: ["HIIT", "fitness", "workout"],
    },
    {
      title: "Zumba Dance Party",
      description:
        "Dance to the rhythm and feel the energy with our Zumba Dance Party! Join us for an exhilarating session of dance and fitness.",
      date: new Date(),
      time: "7:30 PM",
      location: "Dance Central Studio",
      image: "zumba.jpg",
      user: dan._id,
      tags: ["Zumba", "dance", "fitness"],
    },
    {
      title: "Running Club Meetup",
      description:
        "Join our running club meetup and explore the scenic routes in the city. Whether you're a beginner or an experienced runner, everyone is welcome!",
      date: new Date(),
      time: "8:00 AM",
      location: "City Park",
      image: "running.jpg",
      user: dan._id,
      tags: ["running", "club", "meetup"],
    },
    {
      title: "Pilates for Beginners",
      description:
        "Discover the benefits of Pilates with our beginner-friendly class. Improve your core strength, flexibility, and posture in a supportive environment.",
      date: new Date(),
      time: "10:00 AM",
      location: "Pilates Studio",
      image: "pilates.jpg",
      user: dan._id,
      tags: ["pilates", "fitness", "beginner"],
    },
    {
      title: "Cycling Adventure",
      description:
        "Embark on a cycling adventure through scenic routes and breathtaking landscapes. All skill levels are welcome!",
      date: new Date(),
      time: "11:00 AM",
      location: "Countryside",
      image: "cycling.jpg",
      user: dan._id,
      tags: ["cycling", "adventure", "outdoor"],
    },
    // Placeholder for additional events
    {
      title: "CrossFit Challenge",
      description:
        "Test your limits with our CrossFit Challenge! Push yourself to the max and experience the ultimate full-body workout.",
      date: new Date(),
      time: "6:30 PM",
      location: "CrossFit Arena",
      image: "crossfit.jpg",
      user: dan._id,
      tags: ["CrossFit", "challenge", "fitness"],
    },
    {
      title: "Martial Arts Seminar",
      description:
        "Join us for a Martial Arts Seminar and learn self-defense techniques, discipline, and respect in a supportive environment.",
      date: new Date(),
      time: "5:00 PM",
      location: "Martial Arts Academy",
      image: "martial-arts.jpg",
      user: dan._id,
      tags: ["martial arts", "seminar", "self-defense"],
    },
    {
      title: "Swimming Workshop",
      description:
        "Dive into the world of swimming with our comprehensive workshop. Learn different strokes, improve technique, and boost confidence in the water.",
      date: new Date(),
      time: "4:00 PM",
      location: "Aquatic Center",
      image: "swimming.jpg",
      user: dan._id,
      tags: ["swimming", "workshop", "fitness"],
    },
    {
      title: "Rock Climbing Adventure",
      description:
        "Embark on an adrenaline-pumping rock climbing adventure! Conquer challenging routes and experience breathtaking views from the top.",
      date: new Date(),
      time: "12:00 PM",
      location: "Rock Climbing Gym",
      image: "rock-climbing.jpg",
      user: dan._id,
      tags: ["rock climbing", "adventure", "outdoor"],
    },
    {
      title: "Dance Fitness Fusion",
      description:
        "Experience the perfect blend of dance and fitness with our Dance Fitness Fusion class. Get ready to groove, sweat, and have fun!",
      date: new Date(),
      time: "7:00 PM",
      location: "Dance Fitness Studio",
      image: "dance-fitness.jpg",
      user: dan._id,
      tags: ["dance fitness", "fusion", "workout"],
    },
    {
      title: "Boxing Bootcamp",
      description:
        "Join our Boxing Bootcamp and unleash your inner warrior! Improve strength, speed, and agility while learning proper boxing techniques.",
      date: new Date(),
      time: "6:00 AM",
      location: "Boxing Gym",
      image: "boxing.jpg",
      user: dan._id,
      tags: ["boxing", "bootcamp", "fitness"],
    },
    // Add more placeholders for events here
  ]);
}
