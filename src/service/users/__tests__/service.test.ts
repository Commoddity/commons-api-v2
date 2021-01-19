import { UsersService, User } from "@services";
import { resetUsers } from "@test";

describe(`UsersService methods`, () => {
  afterEach(async () => {
    await resetUsers();
  });

  describe(`Create User`, () => {
    it(`Creates a new user in the DB `, async () => {
      const testNewUser = new User({
        first_name: "Ronald",
        last_name: "McDonald",
        username: "clowngod774",
        email: "burgers@yourface.com",
      });

      const createdNewUser = await new UsersService().createUser(testNewUser);

      expect(createdNewUser).toMatchObject(testNewUser);
      expect(createdNewUser.id).toBeTruthy();
      expect(createdNewUser.created_at).toBeTruthy();
    });
  });
});
