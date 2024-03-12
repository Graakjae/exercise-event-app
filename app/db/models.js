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
    name: {
      type: String,
      required: true, // Ensure user emails are required
    },
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

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [50, "Title must be at most 50 characters"],
    },
    description: {
      type: String,
      required: true,
      minLength: [3, "Description must be at least 3 characters"],
      maxLength: [1000, "Description must be at most 1000 characters"],
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        commentText: {
          type: String,
          required: true,
          minLength: [1, "Comment too short, min is 1 character"],
          maxLength: [1000, "Comment too long, max is 1000 characters"],
        },
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    tags: [String],
  },
  { timestamps: true },
);
export const models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Event", schema: eventSchema, collection: "events" },
];
