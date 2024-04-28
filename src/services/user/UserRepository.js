class UserRepository {
  constructor(service) {
    this.service = service;
    this.usersCollection = "users";
  }

  async getUserByEmail(email) {
    const db = await this.service.getMongoDb();
    return await db.collection(this.usersCollection).findOne(
      { email },
      {
        projection: {
          customerId: 1,
          userCode: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          salt: 1,
          password: 1,
        },
      }
    );
  }
  async getUserByCustomerId(customerId) {
    const db = await this.service.getMongoDb();
    return await db.collection(this.usersCollection).findOne(
      { customerId },
      {
        projection: {
          customerId: 1,
          userCode: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          salt: 1,
          password: 1,
        },
      }
    );
  }
  async createNewUser(user) {
    const db = await this.service.getMongoDb();
    await db.collection(this.usersCollection).insertOne(user);
    return await this.getUserByCustomerId(user.customerId);
  }
}

export default UserRepository;