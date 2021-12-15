import { extract } from "article-parser";
import Axios, { AxiosResponse } from "axios";
import Cheerio from "cheerio";
import striptags from "striptags";
import mongoose from "mongoose";

import { MapBoxService } from "../../services";
import {
  EDataEndpoints,
  EProvinceCodes,
  EMPOfficeType,
  ESSMParams,
  IArticleData,
  IBill,
  IBillMediaSource,
  IMBFCResults,
  ISourceSplit,
  IMemberOfParliament,
  IMPAddress,
  IMPOffice,
  IRepresentMP,
  IRepresentMPResponse,
  IRepresentOffice,
  PGeocodeQuery,
} from "../../types";
import { FormatUtils, SSMUtil } from "../../utils";

export class WebService {
  async fetchJSON(url: string): Promise<IBill[]> {
    try {
      const { data: json }: AxiosResponse<IBill[]> = await Axios.get(url, {
        timeout: 100000,
      });
      return json;
    } catch (error) {
      throw new Error(`[WEB SERVICE ERROR]: fetchJSON: ${error}`);
    }
  }

  async getCurrentSession(): Promise<{ parliament: number; session: number }> {
    try {
      const legisInfoPage: cheerio.Root = Cheerio.load(
        (await Axios.get<string>("https://www.parl.ca/LegisInfo")).data,
      );
      const [parliament, session] = legisInfoPage("span.parl-session-number")
        .toArray()
        .map((element) => Number(legisInfoPage(element).text().replace(/\D/g, "").trim()));
      return { parliament, session };
    } catch (error) {
      throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
    }
  }

  async getFullTextUrl(pageUrl: string): Promise<string | null> {
    try {
      const legisInfoPage: cheerio.Root = Cheerio.load((await Axios.get<string>(pageUrl)).data);
      const fullTextPath = legisInfoPage(`span:contains("Text of the bill")`)
        .closest("a.publication")
        .attr("href");
      return fullTextPath ? `https://www.parl.ca${fullTextPath}` : null;
    } catch (error) {
      throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
    }
  }

  // private async getSummaries(): Promise<IBillSummaryMap[]> {
  //   try {
  //     const xml = await this.fetchJSON(EBillEndpoints.SUMMARY_URL);
  //     const summariesArray = await FormatUtils.formatSummariesXml<IBillSummary>(xml);

  //     return this.splitSummaries(summariesArray);
  //   } catch (error) {
  //     throw new Error(`[SUMMARIES FETCH ERROR] ${error}`);
  //   }
  // }

  // async updateBills(): Promise<void> {
  //   const service = new BillsService();

  //   try {
  //     const billEventsArray = await this.getAllBillsForSession();
  //     await service.updateBillsAndEvents(billEventsArray);

  //     const billSummaryMaps = await this.getSummaries();
  //     await service.updateSummaryUrls(billSummaryMaps);

  //     await service.closeDbConnection();
  //   } catch (error) {
  //     throw new Error(`[UPDATE DB SCRIPT ERROR]: ${error}`);
  //   }
  // }

  // Returns the raw text from the XML bill, in other words all text within <Text> tags
  // async fetchFullText(fullTextUrl: string): Promise<string | undefined> {
  //   try {
  //     const response: AxiosResponse<string> = await Axios.get(fullTextUrl);
  //     const fullTextPage: cheerio.Root = Cheerio.load(response.data);
  //     const xmlPageLink = fullTextPage('a.btn-export-xml:contains("XML")').attr("href");
  //     const fullTextUrlJoined = `https://www.parl.ca${xmlPageLink}`;

  //     const fullTextXml = await this.fetchJSON(fullTextUrlJoined);

  //     if (fullTextXml) {
  //       const fullTextRaw: string = Cheerio.load(fullTextXml)("text").text();
  //       return fullTextRaw;
  //     }
  //   } catch (error) {
  //     console.error(`An error occurred while fetching raw full text: ${error}`);
  //   }
  // }

  /* Fetch MP Data methods */
  /* Fetches a users MP info, based on address (street, city, province) */
  async fetchMpInfo(query: PGeocodeQuery): Promise<IMemberOfParliament> {
    const { latitude, longitude } = await new MapBoxService().getGeocode(query);

    try {
      const {
        data: { objects },
      } = await Axios.get<IRepresentMPResponse>(
        `${EDataEndpoints.MP_ENDPOINT}/representatives/house-of-commons/?point=${latitude},${longitude}`,
      );
      const [mpData] = objects;

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
    const { tel: phoneNumber } = offices.find(({ type }) => type === EMPOfficeType.constituency);
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

  private parseOfficeData(offices: IRepresentOffice[], name: string): IMPOffice[] {
    return offices.map(({ fax, postal, tel, type }) => ({
      type,
      phoneNumber: tel,
      faxNumber: fax,
      address: this.splitPostal(postal, type, name),
    }));
  }

  private splitPostal(postal: string, type: EMPOfficeType, name: string): IMPAddress {
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

  /* Media Sources methods */
  async getMediaSourceData(mediaSourceUrl: string): Promise<IBillMediaSource> {
    const articleData = await this.fetchArticleData(mediaSourceUrl);
    const { content, hostname, links, ...rest } = articleData;

    const mbfcData = await this.fetchMediaBiasFactCheckData(hostname, articleData.source);
    const bpPressArticleRating = await this.fetchBPPressInfo(content);
    const isEditorial = this.checkIfEditorial(articleData);

    return {
      mediaSourceId: new mongoose.Types.ObjectId().toString(),
      mbfcData: { ...mbfcData },
      bpPressArticleRating,
      isEditorial,
      ...rest,
    } as IBillMediaSource;
  }

  async fetchMediaBiasFactCheckData(hostname: string, source: string): Promise<IMBFCResults> {
    const searchUrl = `${EDataEndpoints.MBFC_HOMEPAGE}/?s=${hostname}`;
    const biasResults: IMBFCResults = {};

    try {
      const searchResults: cheerio.Root = Cheerio.load((await Axios.get<string>(searchUrl)).data);
      const mediaSourceUrl: string = searchResults(`a:contains("${source}")`).attr("href");

      const mediaSourcePage: cheerio.Root = Cheerio.load(
        (await Axios.get<string>(mediaSourceUrl)).data,
      );
      const biasResultsData = (
        mediaSourcePage(
          'span:contains("Detailed Record"), span:contains("Detailed Report"), span:contains("Detailed Reports")',
        )
          .parent("h3")
          .next("p")
          .text() || mediaSourcePage('p:contains("Factual Reporting")').text()
      ).split("\n");
      biasResultsData.forEach((field) => {
        const split = field.split(":");
        biasResults[FormatUtils.toCamelCase(split[0])] = split[1].trim();
      });

      if (!biasResults?.biasRating) {
        const biasRating = mediaSourcePage(
          'span[style="text-decoration: underline;"]:contains("BIAS")',
        )
          .text()
          .replace("BIAS", "")
          .trim();
        biasResults.biasRating = biasRating;
        biasResults.country = (biasResults as any).worldPressFreedomRank;
        delete (biasResults as any).worldPressFreedomRank;
      }
    } catch (error) {
      throw new Error(`[FETCH MBFC DATA ERROR]: ${error} ${searchUrl} ${source} }}`);
    }

    return biasResults;
  }

  /* Bipartisan Press Data */
  async fetchBPPressInfo(articleText: string): Promise<number> {
    SSMUtil.initInstance();

    try {
      const apiKey = await SSMUtil.getInstance().getVar(ESSMParams.BPPressApiKey);

      const { data } = await Axios.post<number>(
        `${EDataEndpoints.BP_PRESS_AI}`,
        new URLSearchParams({ API: apiKey, Text: articleText }),
        { headers: { "content-type": "application/x-www-form-urlencoded" } },
      );
      return data;
    } catch (error) {
      throw new Error(`[FETCH BP PRESS INFO ERROR] ${error}`);
    }
  }

  async fetchArticleData(url: string): Promise<IArticleData> {
    try {
      const articleData = await extract(url);
      const { content, links, published, source } = articleData;
      const rawText = striptags(content);
      const sourceString = this.getSourceString(source);
      const { hostname } = new URL(links[0]);
      const publicationDate = published || null;

      return FormatUtils.truthy<IArticleData>({
        ...articleData,
        hostname,
        publicationDate,
        content: rawText,
        source: sourceString,
      });
    } catch (error) {
      throw new Error(`[GET ARTICLE TEXT]: ${error}`);
    }
  }

  private sourceSplit: ISourceSplit[] = [{ name: "The Tyee", symbol: "|", sourceBefore: false }];
  private sourceConversion = {
    calgaryherald: "Calgary Herald",
    calgarysun: "Calgary Sun",
    "Canada's National Observer": "National Observer",
    CANADALAND: "Canadaland",
    CTVNews: "CTV News",
    edmontonjournal: "Edmonton Journal",
    financialpost: "Financial Post",
    "Macleans.ca": "Maclean’s Magazine",
    montrealgazette: "Montreal Gazette",
    nationalpost: "National Post",
    ottawacitizen: "Ottawa Citizen",
    ottawasun: "Ottawa Sun",
    PressProgress: "Press Progress",
    "thestar.com": "Toronto Star",
    vancouversun: "Vancouver Sun",
  };

  private getSourceString(sourceInput: string): string {
    const checkSplit = ({ name }: ISourceSplit) => sourceInput.includes(name);
    const requiresSplit = this.sourceSplit.some(checkSplit);

    if (requiresSplit) {
      const { symbol, sourceBefore } = this.sourceSplit.find(checkSplit);
      return sourceInput.split(symbol)[sourceBefore ? 0 : 1].trim();
    } else {
      return this.sourceConversion[sourceInput] || sourceInput.trim();
    }
  }

  private checkIfEditorial({ description, title, url }: IArticleData): boolean {
    const fieldsToCheck = `${description} ${title} ${url}`.toLowerCase();
    const keywords = ["editorial", "opinion", "commentary", "critique"];
    return keywords.some((word) => fieldsToCheck.includes(word));
  }
}
