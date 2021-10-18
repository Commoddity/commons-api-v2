import AWS from "aws-sdk";

import { ESSMParams } from "../types";

const awsConfig: AWS.ConfigurationOptions = {
  region: "ca-central-1",
};
if (!process.env.LAMBDA_TASK_ROOT) {
  const profile = "commons-app";
  awsConfig.credentials = new AWS.SharedIniFileCredentials({ profile });
}
AWS.config.update(awsConfig);

const SSM = new AWS.SSM();

interface ICacheEntry {
  value: string;
  expireAt: Date | number;
}

const caching: { [key: string]: ICacheEntry } = {};

export class SSMUtil {
  private environment: string;
  private static instance: SSMUtil;

  constructor() {
    this.environment = process.env.NODE_ENV;
  }

  static initInstance(): void {
    SSMUtil.instance = new SSMUtil();
  }

  static getInstance(): SSMUtil {
    if (!SSMUtil.instance) {
      throw new Error("SSMUtil must be initialized first");
    }

    return SSMUtil.instance;
  }

  public getVar(key: ESSMParams, required = true): Promise<string> {
    const fullKey = `/${this.environment}/${key}`;

    return this.get(fullKey, required);
  }

  public setVar(key: ESSMParams, value: string, overwrite = true): Promise<string> {
    const fullKey = `/${this.environment}/${key}`;

    return this.set(fullKey, value, overwrite);
  }

  private async get(key: string, required = true): Promise<string> {
    console.log(`[SSM]: Requesting SSM parameter ${key}`);

    const cachedValue: string = ProcessCaching.get(`SSMCache#${key}`);

    if (cachedValue) {
      console.log("[SSM]: Getting value from local cache");

      return cachedValue;
    }

    return new Promise<string>((resolve, reject) => {
      SSM.getParameter({ Name: key }, (err, data) => {
        if (!err && data.Parameter.Value) {
          const stringValue = data.Parameter.Value as string;
          ProcessCaching.set(`SSMCache#${key}`, stringValue);

          resolve(stringValue);
        } else if (!err || err.name === "ParameterNotFound") {
          console.log(`[SSM]: Missing configuration for ${key}`);
          ProcessCaching.unset(`SSMCache#${key}`);

          if (required) {
            reject({
              message: `Configuration not found in region ca-central-1 and for key ${key}.`,
              status: 500,
              code: 1002,
            });
          } else {
            resolve(null);
          }
        } else {
          ProcessCaching.unset(`SSMCache#${key}`);
          reject(err);
        }
      });
    });
  }

  private async set(key: string, value: string, overwrite = true): Promise<string> {
    console.log(`[SSM]: Setting SSM parameter ${key}`);

    return new Promise<string>((resolve, reject) => {
      SSM.putParameter(
        { Name: key, Value: value, Overwrite: overwrite, Type: "String" },
        (err, _data) => {
          if (!err) {
            ProcessCaching.set(`SSMCache#${key}`, value);

            resolve(value);
          } else {
            reject(err);
          }
        },
      );
    });
  }
}

class ProcessCaching {
  static get(key: string): string {
    const entry: ICacheEntry = caching[key];

    if (!entry) {
      return;
    }

    if (entry.expireAt < new Date()) {
      ProcessCaching.unset(key);
      return;
    }

    return entry.value;
  }

  static set(key: string, value: string, durationInMn = 5): void {
    const now = new Date();

    caching[key] = {
      value,
      expireAt: now.setMinutes(now.getMinutes() + durationInMn),
    };
  }

  static unset(key: string): void {
    caching[key] = null;
  }
}
