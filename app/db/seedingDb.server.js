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

  console.log("Inserting data...");
  // Insert users and events here
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

  const maria = await User.create({
    _id: new mongoose.Types.ObjectId("65cde4cb0d09cb615a23db18"),
    image:
      "https://images.pexels.com/photos/10669639/pexels-photo-10669639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    mail: "maria@example.com",
    name: "Maria Smith",
    password: "maria1234",
  });

  const john = await User.create({
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    mail: "john@example.com",
    name: "John Doe",
    password: "john1234",
  });

  const emily = await User.create({
    image:
      "https://images.pexels.com/photos/12192379/pexels-photo-12192379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    mail: "emily@example.com",
    name: "Emily Brown",
    password: "emily1234",
  });

  const alex = await User.create({
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    mail: "alex@example.com",
    name: "Alex Johnson",
    password: "alex1234",
  });

  const sophia = await User.create({
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    mail: "sophia@example.com",
    name: "Sophia Wilson",
    password: "sophia1234",
  });

  const emma = await User.create({
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    mail: "emma@example.com",
    name: "Emma Taylor",
    password: "emma1234",
  });

  const william = await User.create({
    image: "",
    mail: "william@example.com",
    name: "William Garcia",
    password: "william1234",
  });

  const olivia = await User.create({
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    mail: "olivia@example.com",
    name: "Olivia Rodriguez",
    password: "olivia1234",
  });

  await Event.insertMany([
    {
      title: "Yoga and Meditation Workshop",
      description:
        "Join us for a deeply enriching session of yoga and meditation. Explore the ancient practices of Hatha and Vinyasa yoga, coupled with mindfulness meditation techniques. Discover inner peace, balance, and harmony as you connect with your body and mind.",
      date: "2024-03-15T00:00:00.000Z",
      time: "9:00",
      address: "Zen Garden Yoga Studio",
      image:
        "https://cdn.pixabay.com/photo/2017/11/18/05/00/woman-2959213_1280.jpg",
      user: dan._id,
      registrations: [
        maria._id,
        rasmus._id,
        rasmus._id,
        john._id,
        emily._id,
        alex._id,
        sophia._id,
        emma._id,
        william._id,
        olivia._id,
      ],
      comments: [
        {
          commentText:
            "I'm really looking forward to this workshop! Yoga and meditation have been life-changing for me.",
          commentedBy: maria._id,
        },
        {
          commentText: "This sounds amazing! Can't wait to join!",
          commentedBy: rasmus._id,
        },
        {
          commentText: "Excited to attend! Yoga always brings such serenity.",
          commentedBy: john._id,
        },
        {
          commentText: "Looking forward to finding my inner balance!",
          commentedBy: emily._id,
        },
        {
          commentText: "Yoga has been transformative for me. Can't wait!",
          commentedBy: alex._id,
        },
        {
          commentText:
            "I've heard great things about this workshop. Looking forward to experiencing it!",
          commentedBy: sophia._id,
        },
        {
          commentText:
            "Yoga has been a fundamental part of my wellness routine. Looking forward to this!",
          commentedBy: emma._id,
        },
        {
          commentText:
            "I'm excited for this workshop! It's always great to connect with others through yoga.",
          commentedBy: william._id,
        },
        {
          commentText: "Looking forward to deepening my practice!",
          commentedBy: olivia._id,
        },
      ],
    },
    {
      title: "High-Intensity Interval Training (HIIT)",
      description:
        "Embark on a heart-pounding journey with our High-Intensity Interval Training (HIIT) program. Experience bursts of intense exercise followed by short recovery periods, designed to torch calories and elevate your fitness levels. Get ready to sweat, burn, and achieve your fitness goals!",
      date: new Date(),
      time: "6:00",
      address: "FitZone Gym",
      image:
        "https://cdn.pixabay.com/photo/2021/01/13/16/46/workout-5914643_1280.jpg",
      user: dan._id,
      registrations: [maria._id],
      comments: [
        {
          commentText:
            "HIIT workouts are the best! Can't wait to get my sweat on.",
          commentedBy: maria._id,
        },
      ],
    },
    {
      title: "Zumba Dance Party",
      description:
        "Let loose and dance your heart out at our electrifying Zumba Dance Party! Groove to infectious rhythms, shake off stress, and burn calories while having the time of your life. Join our vibrant community and experience the joy of dance fitness!",
      date: new Date(),
      time: "7:30",
      address: "Dance Central Studio",
      image: "zumba.jpg",
      user: dan._id,
      registrations: [rasmus._id],
      comments: [
        {
          commentText: "I love Zumba! Can't wait to join the party!",
          commentedBy: rasmus._id,
        },
      ],
    },
    {
      title: "Running Club Meetup",
      description:
        " Lace up your running shoes and join our energetic community for a scenic run through the heart of the city. Whether you're a seasoned runner or just starting out, our inclusive club welcomes all fitness levels. Come explore, connect, and embrace the runner's high!",
      date: new Date(),
      time: "8:00",
      address: "City Park",
      image:
        "https://img.freepik.com/free-photo/disabled-man-running-full-shot_23-2149003148.jpg?t=st=1710260938~exp=1710264538~hmac=139f13a1b9037e4ecd0ad58bc780cea96e75bf8100e34202b6ced88cbda91896&w=2000",
      user: alex._id,
      registrations: [maria._id, rasmus._id, john._id, emily._id],
      comments: [
        {
          commentText:
            "I'm excited for the morning run! City Park is always so beautiful.",
          commentedBy: maria._id,
        },
        {
          commentText: "Looking forward to meeting everyone for the run!",
          commentedBy: rasmus._id,
        },
        {
          commentText: "First time joining the running club. Can't wait!",
          commentedBy: john._id,
        },
        {
          commentText: "Running is my favorite way to start the day!",
          commentedBy: emily._id,
        },
      ],
    },
    {
      title: "Pilates for Beginners",
      description:
        "Embark on a journey of self-discovery with our Pilates for Beginners class. Delve into the foundational principles of Pilates, focusing on core stability, alignment, and mindful movement. Strengthen your body, improve posture, and cultivate a deeper connection between mind and body.",
      date: new Date(),
      time: "10:00",
      address: "Pilates Studio",
      image:
        "https://cdn.pixabay.com/photo/2018/01/01/01/56/yoga-3053487_1280.jpg",
      user: emily._id,
      registrations: [maria._id, john._id],
      comments: [
        {
          commentText:
            "Pilates has been great for my back pain. Excited for the class!",
          commentedBy: maria._id,
        },
        {
          commentText:
            "I've heard Pilates is excellent for improving flexibility.",
          commentedBy: john._id,
        },
      ],
    },
    {
      title: "Cycling Adventure",
      description:
        "Experience the thrill of the open road with our exhilarating Cycling Adventure! Discover new horizons, breathe in the fresh air, and challenge yourself as you pedal through picturesque landscapes. Whether you're a leisure cyclist or avid rider, this adventure is for you!",
      date: new Date(),
      time: "11:00",
      address: "Countryside",
      image:
        "https://cdn.pixabay.com/photo/2022/02/27/06/33/man-7036709_1280.jpg",
      user: rasmus._id,
      registrations: [maria._id, emily._id, alex._id],
      comments: [
        {
          commentText: "Cycling is my favorite way to explore new places!",
          commentedBy: maria._id,
        },
        {
          commentText:
            "Can't wait to enjoy the scenery during the cycling adventure.",
          commentedBy: emily._id,
        },
        {
          commentText: "Ready to hit the road and feel the wind in my hair!",
          commentedBy: alex._id,
        },
      ],
    },
    {
      title: "CrossFit Challenge",
      description:
        "Unleash your inner warrior and push your limits with our CrossFit Challenge! Test your strength, endurance, and mental resilience as you tackle a series of intense workouts designed to take you to the next level. Are you ready to rise to the challenge?",
      date: new Date(),
      time: "6:30",
      address: "CrossFit Arena",
      image:
        "https://cdn.pixabay.com/photo/2017/03/13/20/34/tyre-push-2141096_1280.jpg",
      user: dan._id,
      registrations: [rasmus._id, emily._id, sophia._id],
      comments: [
        {
          commentText:
            "CrossFit workouts always leave me feeling so accomplished!",
          commentedBy: rasmus._id,
        },
        {
          commentText:
            "I love the challenge of CrossFit. Can't wait to see what's in store!",
          commentedBy: emily._id,
        },
        {
          commentText: "Ready to crush it at the CrossFit Challenge!",
          commentedBy: sophia._id,
        },
      ],
    },
    {
      title: "Martial Arts Seminar",
      description:
        "Immerse yourself in the ancient traditions of martial arts with our Martial Arts Seminar. Learn self-defense techniques, cultivate discipline, and enhance your physical and mental well-being in a supportive and empowering environment. Join us on the path to mastery!",
      date: new Date(),
      time: "5:00",
      address: "Martial Arts Academy",
      image:
        "https://cdn.pixabay.com/photo/2017/12/22/17/19/enlogar-3033957_1280.jpg",
      user: sophia._id,
      registrations: [maria._id, john._id, emily._id],
      comments: [
        {
          commentText:
            "Excited to learn some new moves at the martial arts seminar!",
          commentedBy: maria._id,
        },
        {
          commentText:
            "Martial arts has always fascinated me. Can't wait to get started!",
          commentedBy: john._id,
        },
        {
          commentText: "Ready to channel my inner warrior!",
          commentedBy: emily._id,
        },
      ],
    },
    {
      title: "Swimming Workshop",
      description:
        "Dive into the world of swimming with our comprehensive Swimming Workshop. From beginners to advanced swimmers, our expert instructors will guide you through stroke technique, breathing exercises, and water safety skills. Discover the joy and freedom of swimming!",
      date: new Date(),
      time: "4:00",
      address: "Aquatic Center",
      image:
        "https://cdn.pixabay.com/photo/2016/03/27/21/55/girls-1284419_1280.jpg",
      user: olivia._id,
      registrations: [maria._id, alex._id, sophia._id],
      comments: [
        {
          commentText:
            "Swimming is such a refreshing workout. Can't wait for the workshop!",
          commentedBy: maria._id,
        },
        {
          commentText: "Looking forward to improving my stroke technique!",
          commentedBy: alex._id,
        },
        {
          commentText: "Ready to make a splash at the swimming workshop!",
          commentedBy: sophia._id,
        },
      ],
    },
    {
      title: "Rock Climbing Adventure",
      description:
        "Challenge gravity and conquer new heights with our Rock Climbing Adventure! Explore vertical landscapes, navigate challenging routes, and experience the thrill of reaching the summit. Whether you're a seasoned climber or beginner, this adventure will push your limits!",
      date: new Date(),
      time: "12:00",
      address: "Rock Climbing Gym",
      image:
        "https://cdn.pixabay.com/photo/2017/08/07/23/50/climbing-2609319_1280.jpg",
      user: rasmus._id,
      registrations: [rasmus._id, john._id, olivia._id],
      comments: [
        {
          commentText:
            "Rock climbing is the ultimate adrenaline rush! Can't wait to climb!",
          commentedBy: maria._id,
        },
        {
          commentText: "Ready to conquer my fear of heights!",
          commentedBy: emily._id,
        },
      ],
    },
    {
      title: "Dance Fitness Fusion",
      description:
        "Experience the ultimate fusion of dance and fitness with our Dance Fitness Fusion class. Ignite your passion for movement, sweat it out on the dance floor, and sculpt your body with dynamic choreography. Join our community and let the rhythm move you!",
      date: new Date(),
      time: "7:00",
      address: "Dance Fitness Studio",
      image:
        "https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-gymnastics-dance-hall_1157-13817.jpg?t=st=1710259565~exp=1710263165~hmac=cd5e168a33aa201400ad0da10cf78be98bb59545666b301810483ff757bd9894&w=2000",
      user: william._id,
      registrations: [maria._id, sophia._id, emma._id],
      comments: [
        {
          commentText: "Dance fitness is my happy place! Can't wait to groove!",
          commentedBy: maria._id,
        },
        {
          commentText: "So excited for the dance fitness fusion class!",
          commentedBy: sophia._id,
        },
        {
          commentText: "Ready to let loose and dance my heart out!",
          commentedBy: emma._id,
        },
      ],
    },
    {
      title: "Boxing Bootcamp",
      description:
        "Unleash your fighting spirit and transform your body with our Boxing Bootcamp. Learn the fundamentals of boxing technique, build strength, and enhance your cardiovascular endurance in a high-energy, supportive environment. Get ready to punch, sweat, and conquer!",
      date: new Date(),
      time: "6:00",
      address: "Boxing Gym",
      image:
        "https://img.freepik.com/free-photo/two-muscular-boxers-have-competition-ring-they-are-wearing-helmets-gloves_613910-13128.jpg?t=st=1710259618~exp=1710263218~hmac=d15052d6d9f7d3bf52dd13943c0bb31ad9e374b42cec6ab594105a99f0287908&w=2000",
      user: emma._id,
      registrations: [rasmus._id, emily._id, william._id],
      comments: [
        {
          commentText:
            "Boxing bootcamp is always a challenge, but so rewarding!",
          commentedBy: maria._id,
        },
        {
          commentText: "Can't wait to feel the burn at boxing bootcamp!",
          commentedBy: sophia._id,
        },
        {
          commentText: "Ready to lace up my gloves and kick some butt!",
          commentedBy: emily._id,
        },
      ],
    },
  ]);
}
