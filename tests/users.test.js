import  { Users }  from './../controllers/Users';
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/quiz';
import usersCollection from '../models/user'

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
              last_name: "Lastnameson",
            };
      
            user = new Users(Maple.email, Maple.first_name, Maple.last_name, Maple.password);
          } catch (error) {
            console.error("Error connecting to MongoDB:", error);
          };
    })
    afterAll(async () => {    
        // Close the Mongoose connection after all tests are done
        await mongoose.disconnect();

        usersCollection.deleteMany({});
      });

    it("says hello", async () => {
        const hello = 'Hell from quiz app'
        expect(hello).toEqual('Hell from quiz app')
    })

    it("Add a new user Maple", async () => {
        const tester =  user.getUser()
        const createdUser = await user.addUser(tester)
       
        expect(createdUser.first_name).toEqual(tester.first_name)
        expect(createdUser.last_name).toEqual(tester.last_name)
        expect(createdUser.email).toEqual(tester.email)
        expect(createdUser._id).not.toBeNull()
    })

    it("can find user Maple", async () => {
        const tester =  user.getUser()
        const createdUser = await user.addUser(tester)
        const results = await user.getUserById(createdUser._id)

        expect(createdUser._id).not.toBeNull()
        expect(results).not.toBeNull()
        expect(createdUser._id).toEqual(results._id)
    })

    it("can find user Maple", async () => {
        const tester =  user.getUser()
        const createdUser = await user.addUser(tester)
        const results = await user.getUserById(createdUser._id)

        expect(createdUser._id).not.toBeNull()
        expect(results).not.toBeNull()
        expect(createdUser._id).toEqual(results._id)
    })

    it("can update user Maple", async () => {
        const tester =  user.getUser()
        const createdUser = await user.addUser(tester)
        const updatedUser = await user.updateUserById(createdUser._id, {
          email: "maple@trendAfrik.com"
        })
        const results = await user.getUserById(createdUser._id)


        expect(createdUser._id).not.toBeNull()
        expect(results).not.toBeNull()
        expect(updatedUser._id).toEqual(results._id)
        expect(updatedUser.email).toEqual(results.email)
    })

    it("can delete user Maple", async () => {
        const tester =  user.getUser()
        const createdUser = await user.addUser(tester)
        const deletedUser = await user.deleteUser(createdUser._id)

        expect(createdUser._id).not.toBeNull()
        expect(deletedUser).not.toBeNull()
        expect(deletedUser._id).toEqual(createdUser._id)
    })
})