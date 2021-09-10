import { MongooseClient } from "./mongoose-client";
import { SSMUtil } from "../utils";

export async function initClient(): Promise<void> {
  SSMUtil.initInstance();

  await MongooseClient.initInstance();
}
