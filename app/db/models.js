import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ========== models ========== //
const userSchema = new mongoose.Schema(
  {
    image: String,
    mail: {
      type: String,
      required: true, // Ensure user emails are required
      unique: true, // Ensure user emails are unique
    },
    name: String,
    password: {
      type: String,
      required: true, // Ensure user passwords are required
      select: false, // Automatically exclude from query results
    },
  },
  { timestamps: true },
);
// pre save password hook
userSchema.pre("save", async function (next) {
  const user = this; // this refers to the user document

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next(); // continue
  }

  const salt = await bcrypt.genSalt(10); // generate a salt
  user.password = await bcrypt.hash(user.password, salt); // hash the password
  next(); // continue
});

// const entrySchema = new mongoose.Schema(
//   {
//     date: {
//       type: Date,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["work", "learning", "interesting-thing"],
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//   },
//   // Automatically add `createdAt` and `updatedAt` timestamps:
//   // https://mongoosejs.com/docs/timestamps.html
//   { timestamps: true },
// );

// For each model you want to create, please define the model's name, the
// associated schema (defined above), and the name of the associated collection
// in the database (which will be created automatically).
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Too short, min is 3 characters"],
      maxLength: [60, "Too long, max is 60 characters"],
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: new mongoose.Types.ObjectId("65cde4cb0d09cb615a23db17"),
    },
    likes: Number,
    tags: [String],
  },
  { timestamps: true },
);
export const models = [
  // {
  //   name: "Entry",
  //   schema: entrySchema,
  //   collection: "entries",
  // },
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Event", schema: eventSchema, collection: "events" },
];

// async function insertData() {
//   const User = mongoose.models.User;

//   await User.collection.drop();

//   // const entries = [
//   //   {
//   //     date: new Date("2024-01-01"),
//   //     type: "work",
//   //     text: "I'm working",
//   //   },
//   //   {
//   //     date: new Date("2024-01-15"),
//   //     type: "learning",
//   //     text: "I'm learning",
//   //   },
//   //   {
//   //     date: new Date("2024-02-01"),
//   //     type: "interesting-thing",
//   //     text: "I'm doing something interesting",
//   //   },
//   //   {
//   //     date: new Date("2024-02-15"),
//   //     type: "learning",
//   //     text: "Remix Auth with FormStrategy and Post App",
//   //   },
//   //   {
//   //     date: new Date("2024-02-22"),
//   //     type: "work",
//   //     text: "Remix Work Journal",
//   //   },
//   // ];
//   const users = [
//     {
//       email: "test@123.com",
//       password: "123",
//       name: "test",
//     },
//     //one more user
//     {
//       email: "test@1234.com",
//       password: "1234",
//       name: "test2",
//     },
//   ];

//   // await mongoose.models.Entry.insertMany(entries);
//   await mongoose.models.User.insertMany(users);
// }
