import { initClient, closeDbConnection } from "../../../db";
import { MapBoxService } from "../../mapbox";
import { EProvinceCodes } from "../../../types";

beforeAll(async () => {
  await initClient();
});

afterAll(async () => {
  await closeDbConnection();
});

describe(`MapBoxService methods`, () => {
  describe("Get forward Geocode", () => {
    it("Gets a geocode from a query object", async () => {
      const service = new MapBoxService();

      const { latitude, longitude } = await service.getGeocode({
        street: "111 Wellington St",
        city: "Ottawa",
        province: EProvinceCodes.ON,
      });

      expect(typeof latitude).toEqual("number");
      expect(latitude).toEqual(45.421146);
      expect(typeof longitude).toEqual("number");
      expect(longitude).toEqual(-75.696276);
    });
  });
});
