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
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName
} from 'utils';

import create from './create';

import Database, { Node, DatabaseOptions } from './database';
import { ModelList } from './database/datamodel';
import { WhereInputArgs } from './database/where';

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
        //return this.database.whereUnique(typeName, where);
      };
      this[typeNameToPluralHistoryFieldName(typeName)] = (args: WhereInputArgs) => {
        //return this.database.where(typeName, args).nodes;
      };
      this[typeNameToConnectionFieldName(typeName)] = (args: WhereInputArgs) => {
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
        return data.map((item: object) => this[typeNameToCreateFieldName(typeName)](item));
      }
      this[typeNameToUpdateFieldName(typeName)] = ({ where, data }) => {
        let hist = this.database.whereUnique(typeName, where);
        //return updateHist(hist, data);
      };
      this[typeNameToUpdateManyFieldName(typeName)] = ({ where, orderBy, data }) => {
        // let hists = this.database.where(typeName, { where, orderBy }).hists;
        // let batch: (Hist | null)[] = [];
        // hists.forEach((hist: Hist) => {
        //   batch.push(updateHist(hist, data));
        // });
        // return batchPayload(batch);
      };
      this[typeNameToUpsertFieldName(typeName)] = ({ where, update, create }) => {
        let result = this[typeNameToUpdateFieldName(typeName)]({ where, data: update });
        if(result !== undefined) {
          return result;
        } else {
          return this[typeNameToCreateFieldName(typeName)](create);
        }
      };
      this[typeNameToDeleteFieldName(typeName)] = (where: object) => {
        // let hist = this.database.where(typeName, { where });
        // return deleteHist(hist);
      };
      this[typeNameToDeleteManyFieldName(typeName)] = ({ where, orderBy }) => {
        // let hists = this.database.where(typeName, { where, orderBy }).hists;
        // let batch: (Hist | null)[] = [];
        // hists.forEach((hist: Hist) => {
        //   //batch.push(deleteHist(hist));
        // });
        // return batchPayload(batch, 1);
      };
      this[typeNameToRestoreFieldName(typeName)] = (where: object) => {
        // let hist = this.database.where(typeName, { where });
        // return restoreHist(hist);
      };
      this[typeNameToRestoreManyFieldName(typeName)] = ({ where, orderBy }) => {
        // let hists = this.database.where(typeName, { where, orderBy }).hists;
        // let batch: (Hist | null)[] = [];
        // hists.forEach((hist: Hist) => {
        //   batch.push(restoreHist(hist));
        // });
        // return batchPayload(batch);
      };
    });
  }
}
