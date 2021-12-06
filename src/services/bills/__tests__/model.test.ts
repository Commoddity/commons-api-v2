// import { PBillEvent } from "../../../types";

// import { BillInput, createBill } from "..";

// describe.skip(`Bill model`, () => {
//   const testBillEvents: PBillEvent[] = [
//     {
//       title: "C-8, Introduction and First Reading in the House of Commons",
//       link: "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686845",
//       description: "C-8, An Act to amend the Criminal Code (conversion therapy)",
//       pubDate: "Mon, 09 Mar 2020 00:00:00 EST",
//     },
//     {
//       title: "C-237, Placed in the Order of Precedence in the House of Commons",
//       link: "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10660264",
//       description: "C-237, An Act to establish a national framework for diabetes",
//       pubDate: "Thu, 05 Mar 2020 00:00:00 EST",
//     },
//   ];

//   describe(`Create Bill from PBillEvent using createBill factory method`, () => {
//     it(`Creates a new instance of the Bill class from a Legisinfo PBillEvent object`, async () => {
//       const newBill = await createBill(testBillEvents[0]);

//       const testBill = {
//         code: "C-8",
//         title: "An Act to amend the Criminal Code (conversion therapy)",
//         description:
//           "This enactment amends the Criminal Code to, among other things, create the following offences: (a) causing a person to undergo conversion therapy against the person’s will; (b) causing a child to undergo conversion therapy; (c) doing anything for the purpose of removing a child from Canada with the intention that the child undergo conversion therapy outside Canada; (d) advertising an offer to provide conversion therapy; and (e) receiving a financial or other material benefit from the provision of conversion therapy. It also amends the Criminal Code to authorize courts to order that advertisements for conversion therapy be disposed of or deleted.",
//         introducedDate: "2020/03/09",
//         pageUrl:
//           "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686845",
//         fullTextUrl: "https://parl.ca/DocumentViewer/en/10688120",
//         summaryUrl: undefined,
//         passed: undefined,
//       };

//       expect(newBill).toEqual(testBill);
//     });

//     it(`Creates a new instance of the Bill class from a Legisinfo PBillEvent object`, async () => {
//       const newBill = await createBill(testBillEvents[1]);

//       const testBill = {
//         code: "C-237",
//         title: "An Act to establish a national framework for diabetes",
//         description:
//           "This enactment provides for the development of a national framework designed to support improved access for Canadians to diabetes prevention and treatment.",
//         introducedDate: "2020/02/27",
//         pageUrl:
//           "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10660264",
//         fullTextUrl: "https://parl.ca/DocumentViewer/en/10670705",
//         summaryUrl: undefined,
//         passed: undefined,
//       };

//       expect(newBill).toEqual(testBill);
//     });
//   });

//   describe("Private async data fetching methods", () => {
//     const testBillPrototype = new BillInput(testBillEvents[0]);
//     const ProtoBill = Object.getPrototypeOf(testBillPrototype);

//     describe("fetchFullTextUrl", () => {
//       const testBillCode = "S-215";
//       const testPageUrl =
//         "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436";
//       const testFullTextUrl = "https://parl.ca/DocumentViewer/en/10637457";
//       const testBillCodeNoFullText = "C-1";
//       const testNoFullTextUrl =
//         "https://www.parl.ca/legisinfo/BillDetails.aspx?Language=E&billId=10600395";

//       it("Fetches the full text url if available", async () => {
//         const testFullTextUrlResponse = await ProtoBill.fetchFullTextUrl({
//           pageUrl: testPageUrl,
//           billCode: testBillCode,
//         });

//         expect(testFullTextUrlResponse).toEqual(testFullTextUrl);
//       });

//       it("Skips the bill if no full text available", async () => {
//         const testNoFullTextUrlResponse = await ProtoBill.fetchFullTextUrl({
//           pageUrl: testNoFullTextUrl,
//           billCode: testBillCodeNoFullText,
//         });

//         expect(testNoFullTextUrlResponse).toEqual(undefined);
//       });
//     });

//     describe("fetchIntroducedDate", () => {
//       jest.setTimeout(30000);

//       it("Fetches the introduced date if available for bill S-215", async () => {
//         const testIntroducedDate = "2020/02/18";
//         const testIntroducedDateResponse = await ProtoBill.fetchIntroducedDate({
//           pageUrl:
//             "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436",
//           billCode: "S-215",
//         });

//         expect(testIntroducedDateResponse).toEqual(testIntroducedDate);
//       });

//       it("Fetches the introduced date if available for bill S-217", async () => {
//         const testIntroducedDate = "2020/11/05";
//         const testIntroducedDateResponse = await ProtoBill.fetchIntroducedDate({
//           pageUrl:
//             "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10938159",
//           billCode: "S-217",
//         });

//         expect(testIntroducedDateResponse).toEqual(testIntroducedDate);
//       });

//       it("Fetches the introduced date if available for bill C-4", async () => {
//         const testIntroducedDate = "2020/09/28";
//         const testIntroducedDateResponse = await ProtoBill.fetchIntroducedDate({
//           pageUrl:
//             "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10867435",
//           billCode: "C-4",
//         });

//         expect(testIntroducedDateResponse).toEqual(testIntroducedDate);
//       });

//       it("Fetches the introduced date if it was reinstated from a previous session", async () => {
//         const testReinstatedIntroducedDate = "2020/02/25";
//         const testNoIntroducedDateResponse = await ProtoBill.fetchIntroducedDate({
//           pageUrl:
//             "https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10866196",
//           billCode: "C-226",
//         });

//         expect(testNoIntroducedDateResponse).toEqual(testReinstatedIntroducedDate);
//       });
//     });

//     describe("fetchDescription", () => {
//       it("fetchFullTextUrl fetches the description if available", async () => {
//         const testBillCode = "C-237";
//         const testFullTextUrl =
//           "https://parl.ca/DocumentViewer/en/43-1/bill/C-237/first-reading";
//         const testDescription =
//           "This enactment provides for the development of a national framework designed to support improved access for Canadians to diabetes prevention and treatment.";
//         const descriptionResponse = await ProtoBill.fetchDescription({
//           pageUrl: testFullTextUrl,
//           billCode: testBillCode,
//         });

//         expect(descriptionResponse).toEqual(testDescription);
//       });

//       it("fetchFullTextUrl fetches the description if available", async () => {
//         const testBillCode = "C-8";
//         const testFullTextUrl =
//           "https://parl.ca/DocumentViewer/en/43-1/bill/C-8/first-reading";
//         const testDescription =
//           "This enactment amends the Criminal Code to, among other things, create the following offences: (a) causing a person to undergo conversion therapy against the person’s will; (b) causing a child to undergo conversion therapy; (c) doing anything for the purpose of removing a child from Canada with the intention that the child undergo conversion therapy outside Canada; (d) advertising an offer to provide conversion therapy; and (e) receiving a financial or other material benefit from the provision of conversion therapy. It also amends the Criminal Code to authorize courts to order that advertisements for conversion therapy be disposed of or deleted.";
//         const descriptionResponse = await ProtoBill.fetchDescription({
//           pageUrl: testFullTextUrl,
//           billCode: testBillCode,
//         });

//         expect(descriptionResponse).toEqual(testDescription);
//       });

//       it("fetchFullTextUrl fetches the description if available", async () => {
//         const testBillCode = "C-2";
//         const testFullTextUrl =
//           "https://parl.ca/DocumentViewer/en/43-2/bill/C-2/first-reading";
//         const testDescription =
//           "Her Excellency the Governor General recommends to the House of Commons the appropriation of public revenue under the circumstances, in the manner and for the purposes set out in a measure entitled “An Act relating to economic recovery in response to COVID-19”.  Part 1 enacts the Canada Recovery Benefits Act to authorize the payment of the Canada recovery benefit, the Canada recovery sickness benefit and the Canada recovery caregiving benefit to support Canada’s economic recovery in response to COVID-19. It also makes consequential amendments to the Income Tax Act and the Income Tax Regulations. Part 2 amends the Canada Labour Code to, among other things, (a) amend the reasons for which an employee is entitled to take leave related to COVID-19, and the number of weeks of that leave that an employee may take for each of those reasons; and (b) give the Governor in Council the power, until September 25, 2021, to make regulations in certain circumstances to provide that any requirements or conditions, set out in certain provisions of Part III of that Act, respecting certificates issued by a health care practitioner do not apply and to provide for alternative requirements and conditions. This Part also makes related amendments to the COVID-19 Emergency Response Act to ensure that employees may continue to take leave related to COVID-19 until September 25, 2021. Finally, it makes related amendments to regulations and contains coordinating amendments. Part 3 amends the Public Health Events of National Concern Payments Act to limit, as of October 1, 2020, the payments that may be made out of the Consolidated Revenue Fund under that Act to those in respect of specified measures related to COVID-19, up to specified amounts. It also postpones the repeal of that Act until December 31, 2020.";
//         const descriptionResponse = await ProtoBill.fetchDescription({
//           pageUrl: testFullTextUrl,
//           billCode: testBillCode,
//         });

//         expect(descriptionResponse).toEqual(testDescription);
//       });
//     });
//   });
// });
