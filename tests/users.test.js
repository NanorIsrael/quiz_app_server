import UserDataSource from "./../controllers/Users";
import usersCollection from "../models/user";
import Auth from "../models/auth";

const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

describe("Users", () => {
  let Maple;
  let user;

  beforeAll(async () => {
    try {
      // Connect to the MongoDB database
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      Maple = {
        email: "maple@gvtech.com",
        password: "Mapleme@123",
        first_name: "Maple",
        last_name: "Tester",
      };

      user = new UserDataSource(
        Maple.email,
        Maple.first_name,
        Maple.last_name,
        Maple.password,
      );
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  beforeEach(async () => {
    await usersCollection.deleteMany({});
  });

  afterAll(async () => {
    // Close the Mongoose connection after all tests are done
    await mongoose.disconnect();
  });

  it("says hello", async () => {
    const hello = "Hell from quiz app";
    expect(hello).toEqual("Hell from quiz app");
  });

  it("Add a new user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);

    expect(createdUser.first_name).toEqual(tester.first_name);
    expect(createdUser.last_name).toEqual(tester.last_name);
    expect(createdUser.email).toEqual(tester.email);
    expect(createdUser._id).not.toBeNull();
  });

  it("ensures Maples password is hashed", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const userFromDb = await usersCollection.findById(createdUser._id);

    expect(createdUser.password).not.toEqual(tester.password);
    expect(createdUser.password).toEqual(userFromDb.password);
  });

  it("can find user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const results = await user.getUserById(createdUser._id);

    expect(createdUser._id).not.toBeNull();
    expect(results).not.toBeNull();
    expect(createdUser._id).toEqual(results._id);
  });

  it("can find user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const results = await user.getUserById(createdUser._id);

    expect(createdUser._id).not.toBeNull();
    expect(results).not.toBeNull();
    expect(createdUser._id).toEqual(results._id);
  });

  it("can update user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const updatedUser = await user.updateUserById(createdUser._id, {
      email: "maple@trendAfrik.com",
    });
    const results = await user.getUserById(createdUser._id);

    expect(createdUser._id).not.toBeNull();
    expect(results).not.toBeNull();
    expect(updatedUser._id).toEqual(results._id);
    expect(updatedUser.email).toEqual(results.email);
  });

  it("can delete user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const deletedUser = await user.deleteUser(createdUser._id);

    expect(createdUser._id).not.toBeNull();
    expect(deletedUser).not.toBeNull();
    expect(deletedUser._id).toEqual(createdUser._id);
  });

  it("can login user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const results = await user.login(createdUser.email, tester.password);

    expect(createdUser._id).not.toBeNull();
    expect(results.accessToken).toBeTruthy();
    expect(Object.keys(results)).toHaveLength(4);
  });

  it("can logout user Maple", async () => {
    const tester = user.getUser();
    const createdUser = await user.addUser(tester);
    const tokens = await user.login(createdUser.email, tester.password);
    expect(tokens.accessToken).toBeTruthy();
    expect(Object.keys(tokens)).toHaveLength(4);

    const results = await user.logout(createdUser._id);
    const authResults = await Auth.findOne({ userId: createdUser._id });
    expect(authResults).toBeNull();
    expect(results.deletedCount).toEqual(2);
  });
});
