import { Schema, model } from "mongoose";

export type UserT = {
  username: string;
  name: string;
  email: string;
  password: string;
  id: string;
  admin?: boolean;
};

const userSchema = new Schema<UserT>({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
});

setSchemaID(userSchema);

type UserSchemaT = typeof userSchema;

const User = model("User", userSchema);

function setSchemaID(schema: UserSchemaT) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
}

export interface UserRepository {
  findByEmail: (email: string) => Promise<UserT | null>;
  findByUsername: (username: string) => Promise<UserT | null>;
  findById: (id: string) => Promise<UserT | null>;
  createUser: (user: Omit<UserT, "id">) => Promise<string>; //returns id of user created.
}

export const userRepository: UserRepository = {
  findByEmail: async (email: string): Promise<UserT | null> => {
    return User.findOne({ email });
  },
  findByUsername: async (username: string): Promise<UserT | null> => {
    return User.findOne({ username });
  },
  findById: async (id: string): Promise<UserT | null> => {
    return User.findById(id);
  },
  createUser: async (user: Omit<UserT, "id">): Promise<string> => {
    return new User(user).save().then((data) => data.id);
  },
};
