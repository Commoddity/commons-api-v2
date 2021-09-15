import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";

import { BillsService, MapBoxService } from "../../services";
import {
  EBillEndpoints,
  EDataEndpoints,
  EProvinceCodes,
  EMPOfficeType,
  IBillSummary,
  IBillSummaryMap,
  IMemberOfParliament,
  IMPAddress,
  IMPOffice,
  IRepresentMP,
  IRepresentMPResponse,
  IRepresentOffice,
  PBillEvent,
  PGeocodeQuery,
} from "../../types";
import { FormatUtils } from "../../utils";

export class WebService {
  async updateBills(): Promise<void> {
    const service = new BillsService();

    try {
      const billEventsArray = await this.getLegisInfoCaller();
      await service.updateBillsAndEvents(billEventsArray);

      const billSummaryMaps = await this.getSummaries();
      await service.updateSummaryUrls(billSummaryMaps);

      await service.closeDbConnection();
    } catch (error) {
      throw new Error(`[UPDATE DB SCRIPT ERROR]: ${error}`);
    }
  }

  private async getLegisInfoCaller(): Promise<PBillEvent[]> {
    try {
      const xml = await this.fetchXml(EBillEndpoints.LEGISINFO_URL);
      return FormatUtils.formatXml<PBillEvent>(xml);
    } catch (error) {
      throw new Error(`[LEGISINFO CALLER ERROR] ${error}`);
    }
  }

  private async getSummaries(): Promise<IBillSummaryMap[]> {
    try {
      const xml = await this.fetchXml(EBillEndpoints.SUMMARY_URL);
      const summariesArray = await FormatUtils.formatXml<IBillSummary>(xml);

      return this.splitSummaries(summariesArray);
    } catch (error) {
      throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
    }
  }

  private splitSummaries(
    fetchedSummaryArray: IBillSummary[],
  ): IBillSummaryMap[] {
    const summariesArray: IBillSummaryMap[] = [];

    fetchedSummaryArray.forEach((summary) => {
      if (summary.title.includes("Legislative Summary Published for ")) {
        const summaryBillCode = summary.title
          .split("Legislative Summary Published for ")[1]
          .split(",")[0];

        const summaryObject: IBillSummaryMap = {
          code: summaryBillCode,
          url: summary.link,
        };

        summariesArray.push(summaryObject);
      }
    });

    return summariesArray;
  }

  // Returns the XML document from a given URL
  private async fetchXml(url: string): Promise<string> {
    try {
      const { data: xml }: AxiosResponse<string> = await Axios.get(url, {
        timeout: 100000,
      });
      return xml;
    } catch (error) {
      throw new Error(`[WEB SERVICE ERROR]: fetchXml: ${error}`);
    }
  }

  // Returns the raw text from the XML bill, in other words all text within <Text> tags
  async fetchFullText(fullTextUrl: string): Promise<string | undefined> {
    try {
      const response: AxiosResponse<string> = await Axios.get(fullTextUrl);
      const fullTextPage: cheerio.Root = Cheerio.load(response.data);
      const xmlPageLink = fullTextPage('a.btn-export-xml:contains("XML")').attr(
        "href",
      );
      const fullTextUrlJoined = `https://www.parl.ca${xmlPageLink}`;

      const fullTextXml = await this.fetchXml(fullTextUrlJoined);

      if (fullTextXml) {
        const fullTextRaw: string = Cheerio.load(fullTextXml)("text").text();
        return fullTextRaw;
      }
    } catch (error) {
      console.error(`An error occurred while fetching raw full text: ${error}`);
    }
  }

  // Fetches a users MP info, based on postal code
  async fetchMpInfo(query: PGeocodeQuery): Promise<IMemberOfParliament> {
    const { latitude, longitude } = await new MapBoxService().getGeocode(query);

    try {
      const {
        data: { objects },
      } = await Axios.get<IRepresentMPResponse>(
        `${EDataEndpoints.MP_ENDPOINT}/representatives/house-of-commons/?point=${latitude},${longitude}`,
      );
      const [mpData] = objects;

      console.log(mpData);

      return this.parseMpData(mpData);
    } catch (error) {
      throw new Error(`[FETCH MP INFO ERROR] ${error}`);
    }
  }

  private parseMpData({
    district_name,
    email,
    extra: { preferred_languages },
    name,
    offices,
    party_name,
    photo_url,
    url,
  }: IRepresentMP): IMemberOfParliament {
    const { tel: phoneNumber } = offices.find(
      ({ type }) => type === EMPOfficeType.constituency,
    );
    return {
      name,
      party: party_name,
      riding: district_name,
      email,
      phoneNumber,
      ourCommonsUrl: url,
      photoUrl: photo_url,
      preferredLanguages: preferred_languages,
      offices: this.parseOfficeData(offices, name),
    };
  }

  private parseOfficeData(
    offices: IRepresentOffice[],
    name: string,
  ): IMPOffice[] {
    return offices.map(({ fax, postal, tel, type }) => ({
      type,
      phoneNumber: tel,
      faxNumber: fax,
      address: this.splitPostal(postal, type, name),
    }));
  }

  private splitPostal(
    postal: string,
    type: EMPOfficeType,
    name: string,
  ): IMPAddress {
    const splitAddress = postal.split("\n");
    if (type === EMPOfficeType.constituency) splitAddress.shift();
    const [street] = splitAddress;
    const [cityProvince, postalCode] = splitAddress[1].split("  ");
    const [city, province] = cityProvince.split(" ");

    return {
      name,
      street,
      city,
      province: EProvinceCodes[province],
      postalCode,
    };
  }
}
