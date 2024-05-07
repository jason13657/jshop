import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

setSchemaID(userSchema);

type UserSchemaT = typeof userSchema;

const User = Mongoose.model("User", userSchema);

export async function findByUsername(username: string) {
  return User.findOne({ username });
}

export async function findById(id: string) {
  return User.findById(id);
}

export async function createUser(user: UserSchemaT) {
  return new User(user).save().then((data) => data.id);
}

function setSchemaID(schema: UserSchemaT) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
}
