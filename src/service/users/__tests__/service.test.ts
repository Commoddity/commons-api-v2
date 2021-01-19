import { UsersService, User, UserCredentials } from "@services";
import { resetUsers } from "@test";

describe(`UsersService methods`, () => {
  beforeEach(async () => {
    await resetUsers();
  });
  afterEach(async () => {
    // await resetUsers();
  });

  describe(`Create User`, () => {
    it(`Creates a new user in the DB and adds user credentials`, async () => {
      const testNewUser = new User({
        first_name: "Ronald",
        last_name: "McDonald",
        username: "clowngod774",
        email: "burgertime@yahoo.com",
      });

      const createdNewUser = await new UsersService().createUser(testNewUser);

      expect(createdNewUser).toMatchObject(testNewUser);
      expect(createdNewUser.id).toBeTruthy();
      expect(createdNewUser.id).toHaveLength(20);
      expect(createdNewUser.created_at).toBeTruthy();
      expect(createdNewUser.email).toEqual("burgertime@yahoo.com");

      const testNewUserCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Apple,
        user_id: createdNewUser.id!,
      });

      const createdNewUserCredentials = await new UsersService().createUserCredentials(
        testNewUserCredentials,
      );

      expect(createdNewUserCredentials).toMatchObject(testNewUserCredentials);
      expect(createdNewUserCredentials.id).toBeTruthy();
      expect(createdNewUserCredentials.user_id).toBeTruthy();
      expect(createdNewUserCredentials.type).toEqual("apple");
    });
  });
});
