import { ParliamentsService } from "@services";

describe(`ParliamentsService methods`, () => {
  describe(`Test queryLatestParliamentarySession`, () => {
    it(`gets the latest parilamentary session id`, async () => {
      const latestParliamentarySessionId = await new ParliamentsService().queryLatestParliamentarySession();

      expect(latestParliamentarySessionId).toBeTruthy;
      expect(typeof latestParliamentarySessionId).toEqual("string");
    });
  });
});
