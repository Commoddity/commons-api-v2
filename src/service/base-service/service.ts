import { db } from "@config";
import SqlString from "sqlstring";

import { CreateParams, Value } from "@types";

export class BaseService<T> {
  async createOne({
    table,
    entityValues,
  }: CreateParams<T>): Promise<T | undefined> {
    let entity: T;

    const columns: string[] = Object.keys(entityValues);
    const values: Value[] = Object.values(entityValues);

    const columnString: string =
      columns.length === 1
        ? `${columns[0]} = ?, created_at = ?`
        : columns
            .reduce((columnString: string, nextString: string) =>
              columnString.concat(`${nextString} = ?, }`),
            )
            .concat("created_at = ?");

    const query: string = SqlString.format(
      `
    INSERT INTO ${table} (${columnString})
    RETURNING *`,
      values.concat(Date.now()),
    );

    try {
      const createdEntity = await db.query<T>(query);

      if (createdEntity) {
        entity = createdEntity;
        return entity;
      }
    } catch (err) {
      console.error(`[ENTITY CREATION ERROR]: ${err}`);
      return;
    }
  }

  // public async createMany(
  //   objectsAttributes,
  //   commandType = "Created",
  //   sendEntity = true,
  // ): Promise<any> {
  //   const entitiesAttributes = objectsAttributes.map((objectAttributes) => {
  //     return {
  //       recordStatus: RecordStatus.Created,
  //       ...objectAttributes,
  //     };
  //   });

  //   const entities = await this.queriesCollection.insertMany(
  //     entitiesAttributes,
  //   );
  //   let eventEntities;

  //   try {
  //     eventEntities = await this.persistEvents(
  //       entities,
  //       entitiesAttributes,
  //       commandType,
  //       sendEntity,
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to persist Event: ${error}`);
  //     await this.queriesCollection.remove({
  //       _id: entities.map((entity) => entity.id),
  //     });
  //   }

  //   await this.broadcastDataPersistedEvents({ eventEntities });

  //   return this.buildMultiple(entities);
  // }

  // async update(
  //   query,
  //   objectAttributes,
  //   commandType = "Updated",
  //   sendEntity = true
  // ): Promise<T> {
  //   const previousState = await this.queriesCollection.findOne(query);

  //   if (!previousState) {
  //     throw new DocumentNotFoundError(this.modelName, query);
  //   }

  //   await this.queriesCollection.updateOne(
  //     query,
  //     {$set: objectAttributes},
  //     {new: true}
  //   );

  //   const entity = await this.queriesCollection.findOne({
  //     _id: previousState._id,
  //   });

  //   let eventEntity;

  //   try {
  //     eventEntity = await this.persistEvent(
  //       entity,
  //       objectAttributes,
  //       commandType,
  //       sendEntity
  //     );
  //   } catch (error) {
  //     await this.queriesCollection.updateOne(query, previousState);
  //     throw new Error(`Failed to persist Event: ${error}`);
  //   }

  //   await this.broadcastDataPersistedEvent({eventEntity});

  //   return this.build(entity);
  // }

  // async updatePush(
  //   query,
  //   objectAttributes,
  //   commandType = "Updated",
  //   sendEntity = true
  // ): Promise<T> {
  //   const previousState = await this.queriesCollection.findOne(query);

  //   if (!previousState) {
  //     throw new DocumentNotFoundError(this.modelName, query);
  //   }

  //   await this.queriesCollection.updateOne(
  //     query,
  //     {$push: objectAttributes},
  //     {new: true}
  //   );

  //   const entity = await this.queriesCollection.findOne(query);

  //   let eventEntity;

  //   try {
  //     eventEntity = await this.persistEvent(
  //       entity,
  //       objectAttributes,
  //       commandType,
  //       sendEntity
  //     );
  //   } catch (error) {
  //     await this.queriesCollection.updateOne(query, previousState);
  //     throw new Error(`Failed to persist Event: ${error}`);
  //   }

  //   await this.broadcastDataPersistedEvent({eventEntity});

  //   return this.build(entity);
  // }

  // async updateMany(
  //   query,
  //   objectsAttributes,
  //   commandType = "Updated",
  //   sendEntity = true
  // ): Promise<T | T[]> {
  //   const entities = await this.queriesCollection.find(query);

  //   const documents = await this.queriesCollection.updateMany(query, {
  //     $set: objectsAttributes,
  //   });

  //   let eventEntities;

  //   try {
  //     eventEntities = await this.persistEvents(
  //       entities,
  //       objectsAttributes,
  //       commandType,
  //       sendEntity
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to persist Event: ${error}`);
  //   }

  //   await Promise.all(
  //     eventEntities.map(async (eventEntity) => {
  //       await this.broadcastDataPersistedEvent({eventEntity});
  //     })
  //   );

  //   return this.buildMultiple(entities);
  // }

  // async removeMany(
  //   query,
  //   options = {hard: false},
  //   commandType = "Deleted",
  //   sendEntity = true
  // ): Promise<T | T[]> {
  //   let entities;
  //   let eventEntities;

  //   if (options.hard) {
  //     entities = await this.queriesCollection.find(query);

  //     if (!entities || entities == []) {
  //       throw new DocumentNotFoundError(this.modelName, query);
  //     }

  //     await this.queriesCollection.remove(query);
  //   } else {
  //     entities = await this.queriesCollection.find(query);
  //     const documents = await this.queriesCollection.updateMany(query, {
  //       $set: {recordStatus: RecordStatus.Deleted},
  //     });
  //   }

  //   try {
  //     eventEntities = await this.persistEvents(
  //       entities,
  //       {},
  //       commandType,
  //       sendEntity
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to persist Event: ${error}`);
  //   }

  //   await Promise.all(
  //     eventEntities.map(async (eventEntity) => {
  //       await this.broadcastDataPersistedEvent({eventEntity});
  //     })
  //   );

  //   return this.buildMultiple(entities);
  // }

  // async removeOne(
  //   query,
  //   options = {hard: false},
  //   commandType = "Deleted",
  //   sendEntity = true
  // ): Promise<T> {
  //   let entity;
  //   let eventEntity;

  //   if (options.hard) {
  //     entity = await this.queriesCollection.findOneAndRemove(
  //       this.transformQuery(query, options)
  //     );

  //     if (!entity) {
  //       throw new DocumentNotFoundError(this.modelName, query);
  //     }

  //     eventEntity = await this.persistEvent(
  //       entity,
  //       {},
  //       commandType,
  //       sendEntity
  //     );
  //   } else {
  //     entity = await this.queriesCollection.findOne(
  //       this.transformQuery(query, options)
  //     );

  //     if (!entity) {
  //       throw new DocumentNotFoundError(this.modelName, query);
  //     }

  //     entity.set({recordStatus: RecordStatus.Deleted});
  //     eventEntity = await this.persistEvent(
  //       entity,
  //       {},
  //       commandType,
  //       sendEntity
  //     );

  //     try {
  //       await entity.save();
  //     } catch (error) {
  //       await this.commandsCollection.remove({_id: eventEntity.id});

  //       throw error;
  //     }
  //   }

  //   await this.broadcastDataPersistedEvent({eventEntity});

  //   return this.build(entity);
  // }

  // async findOne(query, options = {}): Promise<T> {
  //   const document = await this.queriesCollection.findOne(
  //     this.transformQuery(query, options),
  //     this.transformProjection(options),
  //     this.transformOptions(options)
  //   );

  //   if (!document) {
  //     throw new DocumentNotFoundError(this.modelName, query);
  //   }

  //   return this.build(document);
  // }

  // async getCount(query = {}, options = {}): Promise<number> {
  //   const count = await this.queriesCollection.count(
  //     this.transformQuery(query, options),
  //     this.transformProjection(options),
  //     this.transformOptions(options)
  //   );

  //   if (!count) {
  //     return 0;
  //   }

  //   return count;
  // }

  // async doesOneExist(query, options = {}): Promise<boolean> {
  //   const document = await this.queriesCollection.findOne(
  //     this.transformQuery(query, options),
  //     this.transformProjection(options),
  //     this.transformOptions(options)
  //   );

  //   if (!document) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // async findMany(query, options = {}): Promise<T[]> {
  //   const documents = await this.queriesCollection.find(
  //     this.transformQuery(query, options),
  //     this.transformProjection(options),
  //     this.transformOptions(options)
  //   );

  //   return this.buildMultiple(documents);
  // }

  // async findAll(query = {}, options = {}): Promise<T[]> {
  //   const documents = await this.queriesCollection.find(
  //     this.transformQuery(query, options),
  //     this.transformProjection(options),
  //     this.transformOptions(options)
  //   );

  //   return this.buildMultiple(documents);
  // }

  // private defaultFactory(data): T {
  //   if (this.klass) {
  //     return new this.klass(data);
  //   } else {
  //     return data;
  //   }
  // }

  // private build(data): T {
  //   if (!data) {
  //     return null;
  //   }

  //   let sanitizedData;

  //   if (data._doc) {
  //     const {_id, __v, ...others} = data._doc;
  //     sanitizedData = {id: data._id, ...others};
  //   } else {
  //     sanitizedData = {id: data._id, ...data};
  //   }

  //   if (this.factory) {
  //     sanitizedData = this.factory(sanitizedData);
  //   }

  //   return this.defaultFactory(sanitizedData);
  // }

  // private buildMultiple(data): T[] {
  //   if (!data) {
  //     return null;
  //   }

  //   return data.map((data) => this.build(data));
  // }

  // private transformProjection(options) {
  //   return options.projection;
  // }

  // private transformOptions(options) {
  //   return {
  //     limit: parseInt(options.limit) || 3000,
  //     sort: options.sort || {createdAt: -1},
  //   };
  // }

  // private transformQuery(query, options) {
  //   const fullOptions = {
  //     excludeDeleted: true,
  //     ...options,
  //   };

  //   let newQuery = query;

  //   if (fullOptions.excludeDeleted) {
  //     newQuery = {...newQuery, recordStatus: {$ne: RecordStatus.Deleted}};
  //   }

  //   return newQuery;
  // }

  // private prepareEntity(entity) {
  //   let entityData;

  //   if (entity._doc) {
  //     const {__v, _id, ...sanitizedEntity} = entity._doc;
  //     entityData = sanitizedEntity;
  //     entityData._id = _id.toString();
  //   } else {
  //     entityData = entity;
  //   }

  //   return entityData;
  // }

  // private getIssuerId(entity, entityType) {
  //   if (this.ctx.state.user) {
  //     return this.ctx.state.user.id;
  //   } else if (entityType == "User") {
  //     return entity._id;
  //   } else {
  //     return null;
  //   }
  // }

  // private getIssuerType(entityType) {
  //   if (this.ctx.state.user) {
  //     return this.ctx.state.user.type;
  //   } else if (entityType == "User") {
  //     return entityType;
  //   } else {
  //     return "Unknown";
  //   }
  // }

  // private buildEvent(
  //   entity,
  //   objectAttributes,
  //   entityType,
  //   commandType,
  //   timestamp,
  //   issuerId,
  //   sendEntity = true
  // ) {
  //   const entityData = sendEntity ? this.prepareEntity(entity) : null;
  //   const args = sendEntity ? objectAttributes : null;

  //   return {
  //     issuerType: this.getIssuerType(entityType),
  //     issuerId: issuerId,
  //     correlatedRequestId: this.ctx.state.correlatedRequestId,
  //     entityId: entity._id,
  //     entityType: entityType,
  //     type: commandType,
  //     entity: entityData,
  //     args,
  //     createdAt: timestamp,
  //   };
  // }

  // private persistEvent(
  //   entity,
  //   objectAttributes,
  //   commandType,
  //   sendEntity = true,
  //   timestamp = Date.now(),
  //   entityType = this.modelName
  // ) {
  //   const issuerId = this.getIssuerId(entity, entityType);
  //   const command = this.buildEvent(
  //     entity,
  //     objectAttributes,
  //     entityType,
  //     commandType,
  //     timestamp,
  //     issuerId,
  //     sendEntity
  //   );
  //   return new this.commandsCollection(command).save();
  // }

  // private persistEvents(
  //   entities,
  //   objectsAttributes,
  //   commandType,
  //   sendEntity = true,
  //   timestamp = Date.now()
  // ) {
  //   const entityType = this.modelName;
  //   const commands = entities.map((entity, index) => {
  //     const issuerId = this.getIssuerId(entity, entityType);
  //     return this.buildEvent(
  //       entity,
  //       objectsAttributes[index],
  //       entityType,
  //       commandType,
  //       timestamp,
  //       issuerId,
  //       sendEntity
  //     );
  //   });

  //   return this.commandsCollection.insertMany(commands);
  // }

  // private async broadcastDataPersistedEvent({eventEntity}) {
  //   const {__v, _id, ...data} = eventEntity._doc;

  //   await new EventSender.Client(this.ctx.state).sendEvent({
  //     data: {
  //       ...data,
  //       entity: this.build(data.entity),
  //       externalId: _id,
  //     },
  //   });
  // }

  // private async broadcastDataPersistedEvents({eventEntities}) {
  //   const data = eventEntities.map((eventEntity) => {
  //     const {__v, _id, ...data} = eventEntity._doc;

  //     return {
  //       ...data,
  //       entity: this.build(data.entity),
  //       externalId: _id,
  //     };
  //   });

  //   await new EventSender.Client(this.ctx.state).sendEvent({data});
  // }
}
