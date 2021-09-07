import { Model as MongoModel, QueryOptions } from "mongoose";

import { MongooseClient } from "@db";
import { ERecordStatus, PQuery, PQueryOptions } from "@types";

export class BaseService<T> {
  private commandsCollection: MongoModel<any>;
  private modelName: string;

  constructor(
    private queriesCollection: MongoModel<any>,
    private klass: any = null,
  ) {
    this.modelName = this.queriesCollection.modelName;
    this.commandsCollection =
      MongooseClient.getInstance().models[this.modelName];
  }

  async closeDbConnection(): Promise<void> {
    await MongooseClient.getInstance().disconnect();
  }

  /* Create methods */
  async createOne(record: T): Promise<T> {
    try {
      const data = await this.commandsCollection.create(record);
      return this.build(data);
    } catch (error) {
      throw new Error(`[RECORD CREATION ERROR]: ${error}`);
    }
  }

  async createMany(records: T[]): Promise<T[]> {
    try {
      const data = await this.commandsCollection.create(records);
      return data.map((data) => this.build(data));
    } catch (error) {
      throw new Error(`[MULTIPLE RECORD CREATION ERROR]: ${error}`);
    }
  }

  /* Read methods */
  async findOne(
    query: PQuery,
    options: QueryOptions = {},
    includeDeleted = false,
  ): Promise<T> {
    try {
      const data = await this.commandsCollection.findOne(
        this.transformQuery(query, includeDeleted),
        this.transformProjection(options),
        this.transformOptions(options),
      );
      return this.build(data);
    } catch (error) {
      throw new Error(`[FIND ONE ERROR]: ${error}`);
    }
  }

  async findMany(
    query: PQuery,
    options: QueryOptions = {},
    includeDeleted = false,
  ): Promise<T[]> {
    try {
      const data = await this.commandsCollection.find(
        this.transformQuery(query, includeDeleted),
        this.transformProjection(options),
        this.transformOptions(options),
      );
      return this.buildMultiple(data);
    } catch (error) {
      throw new Error(`[FIND MANY ERROR]: ${error}`);
    }
  }

  async findAll(
    options: QueryOptions = { limit: 0 },
    includeDeleted = false,
  ): Promise<T[]> {
    try {
      const data = await this.commandsCollection.find(
        this.transformQuery({}, includeDeleted),
        this.transformOptions(options),
      );
      return this.buildMultiple(data);
    } catch (error) {
      throw new Error(`[FIND All ERROR]: ${error}`);
    }
  }

  async findAllDistinct(
    field: string,
    query: PQuery = {},
    includeDeleted = false,
  ) {
    return this.commandsCollection.distinct(
      field,
      this.transformQuery(query, includeDeleted),
    );
  }

  async doesOneExist(query: PQuery): Promise<boolean> {
    try {
      return this.commandsCollection.exists(this.transformQuery(query));
    } catch (error) {
      throw new Error(`[DOES ONE EXIST]: ${error}`);
    }
  }

  /* Update methods */
  async updateOne(query: PQuery, update: PQuery): Promise<T> {
    try {
      await this.commandsCollection.updateOne(query, update);

      const data = await this.commandsCollection.findOne(query);
      return this.build(data);
    } catch (error) {
      throw new Error(`[UPDATE ONE ERROR]: ${error}`);
    }
  }

  async updateMany(query: PQuery, update: PQuery): Promise<T[]> {
    try {
      await this.commandsCollection.updateMany(query, update);

      const data = await this.commandsCollection.find(query);
      return this.buildMultiple(data);
    } catch (error) {
      throw new Error(`[UPDATE MANY ERROR]: ${error}`);
    }
  }

  async updatePush(query: PQuery, update: PQuery): Promise<T> {
    try {
      await this.commandsCollection.updateOne(
        query,
        { $addToSet: update },
        { new: true },
      );

      const data = await this.commandsCollection.findOne(query);
      return this.build(data);
    } catch (error) {
      throw new Error(`[UPDATE PUSH ERROR]: ${error}`);
    }
  }

  async updatePull(query: PQuery, update: PQuery): Promise<T> {
    try {
      await this.queriesCollection.updateOne(
        query,
        { $pull: update },
        { new: true },
      );

      const data = await this.commandsCollection.findOne(query);
      return this.build(data);
    } catch (error) {
      throw new Error(`[UPDATE PUSH ERROR]: ${error}`);
    }
  }

  async updatePushArray(
    query: PQuery,
    array: string,
    arrayFilter: PQuery,
    update: any,
  ): Promise<T> {
    try {
      await this.queriesCollection.updateOne(
        query,
        { $addToSet: { [array]: update } },
        { arrayFilters: [arrayFilter] },
      );

      const data = await this.commandsCollection.findOne(query);
      return this.build(data);
    } catch (error) {
      throw new Error(`[UPDATE PUSH ARRAY ERROR]: ${error}`);
    }
  }

  async updatePullArray(
    query: PQuery,
    array: string,
    arrayFilter: PQuery,
    update: any,
  ): Promise<T> {
    try {
      await this.queriesCollection.updateOne(
        query,
        { $pull: { [array]: update } },
        { arrayFilters: [arrayFilter] },
      );

      const data = await this.commandsCollection.findOne(query);
      return this.build(data);
    } catch (error) {
      throw new Error(`[UPDATE PULL ARRAY ERROR]: ${error}`);
    }
  }

  /* Delete methods */
  async deleteOne(
    query: PQuery,
    options: PQueryOptions = { hard: false },
  ): Promise<void> {
    try {
      if (options.hard) {
        await this.commandsCollection.deleteOne(query);
      } else {
        await this.commandsCollection.updateOne(query, {
          recordStatus: ERecordStatus.Deleted,
        });
      }
    } catch (error) {
      throw new Error(`[DELETE ONE ERROR]: ${error}`);
    }
  }

  async deleteMany(
    query: PQuery,
    options: PQueryOptions = { hard: false },
  ): Promise<void> {
    try {
      if (options.hard) {
        await this.commandsCollection.deleteMany(query);
      } else {
        await this.commandsCollection.updateMany(query, {
          recordStatus: ERecordStatus.Deleted,
        });
      }
    } catch (error) {
      throw new Error(`[DELETE MANY ERROR]: ${error}`);
    }
  }

  /* Query Utils */
  private transformQuery(query: PQuery, includeDeleted = false): PQuery {
    if (includeDeleted) {
      return query;
    } else {
      return {
        ...query,
        recordStatus: { $ne: ERecordStatus.Deleted },
      };
    }
  }

  private transformProjection(options) {
    return options.projection;
  }

  private transformOptions = ({ limit, sort }: QueryOptions): QueryOptions => ({
    limit: limit ?? 3000,
    sort: sort || { createdAt: -1 },
  });

  private build(data: any): T {
    if (!data) {
      return null as any;
    }

    //eslint-disable-next-line
    const { _id, _v, ...others } = data._doc || data;

    return this.factory({ id: _id, ...others });
  }

  private buildMultiple(data: any[]): T[] {
    if (!data || !data?.length) {
      return null as any;
    }

    return data.map((data) => this.build(data));
  }

  private factory(data: any): T {
    if (this.klass) {
      return new this.klass(data);
    } else {
      return data;
    }
  }
}
