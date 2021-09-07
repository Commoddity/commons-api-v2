import mongoose from "mongoose";

export class MongooseClient {
  private static instance: MongooseClient;

  constructor(private nativeClient: mongoose.Mongoose) {}

  static async initInstance(): Promise<void> {
    try {
      const uri =
        "mongodb+srv://pascal:4xYJvwYvVTp5oADuaU6EWKz2taerfu8y9siNZHQQ5527P6cYZchmHFJ@commons-app-db.6pnh0.mongodb.net/commons-app-db";

      const sanitizedUri = MongooseClient.sanitizeUri(uri);
      const initConnectionLog = `Initializing connection to MongoDB using URI ${sanitizedUri} ...`;
      console.log(initConnectionLog);

      await mongoose.connect(uri);
      MongooseClient.instance = new MongooseClient(mongoose);

      console.log(`Successfully connected to MongoDB`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static getInstance(): mongoose.Mongoose {
    if (!MongooseClient.instance) {
      throw new Error("MongooseClient must be initialized first");
    }

    return MongooseClient.instance.nativeClient;
  }

  private static sanitizeUri(uri: string): string {
    return uri?.match(this.HIDE_CREDENTIALS_REGEX)
      ? uri.replace(
          this.HIDE_CREDENTIALS_REGEX.exec(uri)![1],
          this.HIDDEN_CREDENTIALS_PLACEHOLDER,
        )
      : uri;
  }

  private static HIDE_CREDENTIALS_REGEX = /:\/\/(.*)@/g;
  private static HIDDEN_CREDENTIALS_PLACEHOLDER = "<username>:<password>";
}
