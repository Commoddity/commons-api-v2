import { MongooseClient } from "./mongoose-client";

export async function initClient(): Promise<void> {
  await MongooseClient.initInstance();
}
