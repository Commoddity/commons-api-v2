import { ParliamentsService } from "../../parliaments";
import { initClient } from "../../../db";

beforeAll(async () => {
  await initClient();
});

afterAll(async () => {
  await new ParliamentsService().closeDbConnection();
});

describe(`ParliamentsService methods`, () => {
  describe(`Test queryLatestSession`, () => {
    it(`gets the latest parilamentary session id`, async () => {
      const latestParliamentarySessionId =
        await new ParliamentsService().queryLatestSession();

      expect(latestParliamentarySessionId).toBeTruthy;
      expect(typeof latestParliamentarySessionId).toEqual("string");
    });
  });
});
