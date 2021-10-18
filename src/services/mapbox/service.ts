import mapBoxGeocoding, { GeocodeService } from "@mapbox/mapbox-sdk/services/geocoding";

import {
  EProvinceCodes,
  ESSMParams,
  ILatLng,
  IMapBoxResponse,
  PGeocodeQuery,
} from "../../types";
import { SSMUtil } from "../../utils";

export class MapBoxService {
  private geocodingClient: GeocodeService;

  private async initMapBoxClient() {
    const accessToken = await SSMUtil.getInstance().getVar(ESSMParams.MapBoxToken);
    this.geocodingClient = mapBoxGeocoding({ accessToken });
  }

  async getGeocode(query: PGeocodeQuery): Promise<ILatLng> {
    await this.initMapBoxClient();
    const queryString = this.buildQueryString(query);

    try {
      const { body } = await this.geocodingClient
        .forwardGeocode({
          query: queryString,
          limit: 1,
        })
        .send();

      return this.parseResponseBody(body);
    } catch (error) {
      throw new Error(`[MAP BOX GEOCODE ERROR] ${error}`);
    }
  }

  private buildQueryString = (query: PGeocodeQuery): string =>
    Object.values(query)
      .map((field: string | EProvinceCodes) => field.trim().toLowerCase())
      .join(", ");

  private parseResponseBody({ features }: IMapBoxResponse["body"]): ILatLng {
    const [{ geometry }] = features;
    const { coordinates } = geometry;
    const [longitude, latitude] = coordinates;

    return { latitude, longitude };
  }
}
