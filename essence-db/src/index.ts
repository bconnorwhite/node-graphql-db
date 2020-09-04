import {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToCreateFieldName,
  typeNameToCreateManyFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDestroyFieldName,
  typeNameToDestroyManyFieldName,
  typeNameToRollbackFieldName,
  typeNameToRollbackManyFieldName
} from 'essence-tools';

import Database, { Node, DatabaseOptions } from './database';
import { ModelList } from './database/datamodel';
import { WhereInputArgs } from './database/where';

import { Action } from './database/datamodel/types';
export {
  Action,
  ModelList
}

export interface ClientOptions {
  databaseOptions?: DatabaseOptions
}

function aggregate(nodes: Node[]) {
  return {
    count: nodes.length
  };
}

function edges(nodes: Node[]) {
  return nodes.map((node) => ({
    node: node,
    cursor: node['uuid']
  }));
}

function batchPayload(nodes: Node[]) {
  return {
    aggregate: aggregate(nodes),
    edges: edges(nodes)
  }
}

export default class Client {
  database: Database;
  constructor(datamodel: ModelList, options: ClientOptions={}) {
    this.database = new Database(datamodel, options.databaseOptions);
    Object.keys(datamodel).forEach((typeName) => {
      // Queries
      this[typeNameToFieldName(typeName)] = (where: object) => {
        return this.database.whereUnique(typeName, where);
      };
      this[typeNameToPluralFieldName(typeName)] = (args: WhereInputArgs) => {
        return this.database.where(typeName, args).nodes;
      };
      this[typeNameToHistoryFieldName(typeName)] = (where: object) => {
        return this.database.whereUniqueHist(typeName, where);
      };
      this[typeNameToPluralHistoryFieldName(typeName)] = (args: WhereInputArgs) => {
        return this.database.whereHist(typeName, args);
      };
      this[typeNameToConnectionFieldName(typeName)] = (args: WhereInputArgs) => { //are connections really needed?
        let result = this.database.where(typeName, args);
        return {
          pageInfo: {
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
            startCursor: result.nodes[0].uuid,
            endCursor: result.nodes[result.nodes.length-1].uuid
          },
          edges: edges(result.nodes),
          aggregate: aggregate(result.nodes)
        };
      };
      // Mutations
      this[typeNameToCreateFieldName(typeName)] = (data: object) => {
        return this.database.create(typeName, data);
      };
      this[typeNameToCreateManyFieldName(typeName)] = (data: object[]) => {
        let batch = this.database.create(typeName, data);
        return batchPayload(batch);
      }
      this[typeNameToUpdateFieldName(typeName)] = ({ where, data }) => {
        let node = this.database.whereUnique(typeName, where);
        return this.database.update(typeName, node, data);
      };
      this[typeNameToUpdateManyFieldName(typeName)] = ({ where, orderBy, data }) => {
        let result = this.database.where(typeName, where);
        let batch = this.database.update(typeName, result.nodes, data);
        return batchPayload(batch);
      };
      this[typeNameToUpsertFieldName(typeName)] = ({ where, update, create }) => {
        let result = this[typeNameToUpdateFieldName(typeName)]({ where, data: update });
        if(result !== undefined) {
          return result;
        } else {
          return this[typeNameToCreateFieldName(typeName)](create);
        }
      };
      this[typeNameToDestroyFieldName(typeName)] = (where: object) => {
        let nodes = this.database.whereUnique(typeName, where);
        return this.database.destroy(typeName, nodes);
      };
      this[typeNameToDestroyManyFieldName(typeName)] = ({ where, orderBy }) => {
        let result = this.database.where(typeName, { where, orderBy});
        let batch = this.database.destroy(typeName, result.nodes) as Node[];
        return batchPayload(batch);
      };
      this[typeNameToRollbackFieldName(typeName)] = (where: object) => {
        throw new Error(`${typeNameToRollbackFieldName(typeName)} is not yet implemented`);
      };
      this[typeNameToRollbackManyFieldName(typeName)] = ({ where, orderBy }) => {
        throw new Error(`${typeNameToRollbackManyFieldName(typeName)} is not yet implemented`);
      };
    });
  }
}
