"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBill = exports.Bill = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const _utils_1 = require("../../utils");
const parliaments_1 = require("../parliaments");
class Bill {
    constructor({ link, description }) {
        this.code = _utils_1.FormatUtils.formatCode(description);
        this.title = _utils_1.FormatUtils.formatTitle(description);
        this.page_url = link;
        this.summary_url = undefined;
        this.passed = undefined;
    }
    insertFetchedValues(pageUrl, billCode) {
        return __awaiter(this, void 0, void 0, function* () {
            this.parliamentary_session_id = yield new parliaments_1.ParliamentsService().queryLatestParliamentarySession();
            this.introduced_date = yield this.fetchIntroducedDate({
                pageUrl,
                billCode,
            });
            const fullTextUrl = yield this.fetchFullTextUrl({ pageUrl, billCode });
            this.full_text_url = fullTextUrl;
            this.description = fullTextUrl
                ? yield this.fetchDescription({ pageUrl: fullTextUrl, billCode })
                : undefined;
        });
    }
    fetchIntroducedDate({ pageUrl, billCode, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let introducedDate;
            try {
                const { data } = yield axios_1.default.get(pageUrl);
                const billPage = cheerio_1.default.load(data);
                const billReinstated = (_a = billPage('a:contains("Reinstated from previous session")')) === null || _a === void 0 ? void 0 : _a.attr("href");
                if (billReinstated) {
                    introducedDate = yield this.fetchIntroducedDate({
                        pageUrl: `https://www.parl.ca/LegisInfo/${billReinstated}`,
                        billCode,
                    });
                }
                else {
                    const variantOne = billPage('span:contains("House of Commons")')
                        .parentsUntil("li")
                        .find('div.HouseShadeLevel:contains("First Reading")')
                        .parent()
                        .find("span");
                    const variantTwo = billPage('span:contains("House of Commons")')
                        .parentsUntil("ul")
                        .find('div.HouseShadeLevel:contains("First Reading")')
                        .last()
                        .parent()
                        .parent()
                        .find("span");
                    const variantThree = billPage('div.MajorStage:contains("First Reading")')
                        .parent()
                        .find("div.StatusCol2")
                        .find("span");
                    introducedDate = (variantOne.text() ||
                        variantTwo.text() ||
                        variantThree.text()).substring(0, 10);
                    !introducedDate &&
                        console.log(`No introduced date available for Bill ${billCode}. Skipping ...`);
                }
                return introducedDate
                    ? _utils_1.FormatUtils.formatDate(introducedDate)
                    : undefined;
            }
            catch (error) {
                console.error(`[WEB SERVICE ERROR]: fetchIntroducedDate - Bill ${billCode}: ${error}`);
                return undefined;
            }
        });
    }
    fetchFullTextUrl({ pageUrl, billCode, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(pageUrl);
                const billPage = cheerio_1.default.load(data);
                const link = billPage('a:contains("Latest Publication")').attr("href");
                const fullTextUrl = link
                    ? `https:${link}`
                    : undefined;
                !link &&
                    console.log(`No full text available for Bill ${billCode}. Skipping ...`);
                return fullTextUrl;
            }
            catch (error) {
                console.error(`[WEB SERVICE ERROR]: fetchFullTextUrl - Bill ${billCode}: ${error}`);
            }
        });
    }
    fetchDescription({ pageUrl, billCode, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(pageUrl);
                const billPage = cheerio_1.default.load(response.data);
                const variantOne = billPage('h2:contains("SUMMARY")');
                const variantTwo = billPage('div:contains("SUMMARY")');
                const summaryDiv = (variantOne.text() ? variantOne : variantTwo.last())
                    .parent()
                    .parent()
                    .parent()
                    .text();
                const description = summaryDiv === null || summaryDiv === void 0 ? void 0 : summaryDiv.replace(/\s+/g, " ").replace(/RECOMMENDATION\s+/g, " ").replace(/SUMMARY\s+/g, " ").trim();
                return description;
            }
            catch (error) {
                console.error(`[WEB SERVICE ERROR]: fetchDescription - Bill ${billCode}: ${error}`);
            }
        });
    }
}
exports.Bill = Bill;
function createBill(billEvent) {
    return __awaiter(this, void 0, void 0, function* () {
        const NewBill = new Bill(billEvent);
        yield NewBill.insertFetchedValues(NewBill.page_url, NewBill.code);
        return NewBill;
    });
}
exports.createBill = createBill;
