import mongoose from "mongoose";

import { ESSMParams } from "../types";
import { SSMUtil } from "../utils";

export const closeDbConnection = async (): Promise<void> => {
  await MongooseClient.getInstance().disconnect();
};

export class MongooseClient {
  private static instance: MongooseClient;

  constructor(private nativeClient: mongoose.Mongoose) {}

  static async initInstance(): Promise<void> {
    try {
      const uri = await SSMUtil.getInstance().getVar(ESSMParams.MongoConnectionString);

      const sanitizedUri = MongooseClient.sanitizeUri(uri);
      const initConnectionLog = `Initializing connection to MongoDB using URI ${sanitizedUri} ...`;
      console.log(initConnectionLog);

      const envURI = MongooseClient.injectEnv(uri);
      await mongoose.connect(envURI);
      MongooseClient.instance = new MongooseClient(mongoose);

      console.log(`Successfully connected to MongoDB.`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static getInstance(): mongoose.Mongoose {
    if (!MongooseClient.instance) {
      throw new Error("MongooseClient must be initialized first!");
    }

    return MongooseClient.instance.nativeClient;
  }

  private static HIDE_CREDENTIALS_REGEX = /:\/\/(.*)@/g;
  private static HIDDEN_CREDENTIALS_PLACEHOLDER = "<username>:<password>";
  private static sanitizeUri(uri: string): string {
    return uri?.match(this.HIDE_CREDENTIALS_REGEX)
      ? uri.replace(
          this.HIDE_CREDENTIALS_REGEX.exec(uri)![1],
          this.HIDDEN_CREDENTIALS_PLACEHOLDER,
        )
      : uri;
  }

  private static ENV_PLACEHOLDER = "{env}";
  private static injectEnv(uri: string): string {
    return uri.replace(this.ENV_PLACEHOLDER, process.env.NODE_ENV);
  }
}
