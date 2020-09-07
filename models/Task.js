const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    requestType: {
      type: String,
    },
    tasks: {
      type: Array,
    },
    comment: {
      type: String,
    },
    time: {
      type: String,
    },
    paused: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// // fire a function before doc saved to db
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // static method to login user
// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect password");
//   }
//   throw Error("incorrect email");
// };

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
