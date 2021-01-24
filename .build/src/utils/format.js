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
exports.FormatUtils = void 0;
const xml2js_1 = require("xml2js");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
class FormatUtils {
    static formatXml(xml) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield new Promise((resolve, reject) => {
                    xml2js_1.parseString(xml, (error, response) => {
                        if (!error) {
                            const xmlObject = JSON.parse(JSON.stringify(response));
                            const fetchedArray = xmlObject.rss.channel[0].item;
                            if (!fetchedArray.length) {
                                resolve([]);
                            }
                            else {
                                const destructuredArray = fetchedArray.map((item) => {
                                    const destructuredItem = {};
                                    Object.entries(item).forEach((item) => {
                                        const [key, [value]] = item;
                                        destructuredItem[key] = value;
                                    });
                                    return destructuredItem;
                                });
                                resolve(destructuredArray);
                            }
                        }
                        else if (error) {
                            reject(error);
                        }
                    });
                });
            }
            catch (error) {
                throw new Error(`[FORMAT XML ERROR]: ${error}`);
            }
        });
    }
}
exports.FormatUtils = FormatUtils;
FormatUtils.formatDate = (date) => {
    if (dayjs_1.default(date).isValid()) {
        return dayjs_1.default(date).utcOffset(-4).format(`YYYY/MM/DD`);
    }
    else {
        return undefined;
    }
};
FormatUtils.formatCode = (description) => description.toString().substr(0, description.indexOf(","));
FormatUtils.formatTitle = (title) => title.toString().split(/, (.+)/)[1];
