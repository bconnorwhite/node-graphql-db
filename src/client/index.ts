
import { TypeList, DatabaseInterface } from '../interfaces';
import {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToCreateFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName
} from '../utils';

function updateHist(hist, data) {
  if(hist && hist.length > 0 && hist[0]) {
    hist.unshift({
      ...hist[0],
      updatedAt: new Date(),
      ...data
    });
    return hist;
  }
}

function deleteHist(hist) {
  if(hist && hist.length > 0 && hist[0]) {
    hist.unshift(undefined);
    return hist[1];
  }
}

function restoreHist(hist) {
  if(hist && hist.length > 1 && hist[0] == null && hist[1]) {
    hist.shift();
    return hist;
  }
}

function aggregate(hists) {
  return {
    count: hists.length
  };
}

function edges(hists, index: number=0) {
  return hists.map((hist) => {
    if(hist && hist.length > index && hist[index]) {
      return {
        node: hist[index],
        cursor: hist[index].uuid
      }
    }
  })
}

function batchPayload(hists, index: number=0) {
  return {
    aggregate: aggregate(hists),
    edges: edges(hists, index)
  }
}

export default class Client {
  constructor(datamodel: TypeList, database: DatabaseInterface) {
    Object.keys(datamodel).forEach((typeName) => {
      this[typeNameToFieldName(typeName)] = (where) => {
        let hist = database.whereUniqueInput(typeName, where);
        if(hist && hist.length > 0) {
          return hist[0];
        }
      };
      this[typeNameToPluralFieldName(typeName)] = ({ where, orderBy, skip, after, before, first, last }) => {
        let hists = database.whereInput(typeName, where, orderBy, skip, after, before, first, last ).hists;
        return hists.map((hist) => hist[0]);
      };
      this[typeNameToHistoryFieldName(typeName)] = (where) => {
        return database.whereUniqueInput(typeName, where);
      };
      this[typeNameToPluralHistoryFieldName(typeName)] = ({ where, orderBy, skip, after, before, first, last }) => {
        return database.whereInput(typeName, where, orderBy, skip, after, before, first, last ).hists;
      };
      this[typeNameToConnectionFieldName(typeName)] = ({ where, orderBy, skip, after, before, first, last }) => {
        let result = database.whereInput(typeName, where, orderBy, skip, after, before, first, last );
        return {
          pageInfo: {
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
            startCursor: result.hists[0][0].uuid,
            endCursor: result.hists[result.hists.length-1][0].uuid
          },
          edges: edges(result.hists),
          aggregate: aggregate(result.hists)
        };
      };
      this[typeNameToCreateFieldName(typeName)] = (data) => {
        let date = new Date();
        data.uuid = database.generateUUID();
        data.createdAt = date;
        data.updatedAt = date;
        let hist = [data];
        database.data.Node[hist[0].uuid] = hist;
        database.data[typeName][hist[0].uuid] = hist;
        return hist[0];
      };
      this[typeNameToUpdateFieldName(typeName)] = ({ where, data }) => {
        let hist = database.whereUniqueInput(typeName, where);
        return updateHist(hist, data);
      };
      this[typeNameToUpdateManyFieldName(typeName)] = ({ where, orderBy, data }) => {
        let hists = database.whereInput(typeName, where, orderBy).hists;
        let batch = [];
        hists.forEach((hist) => {
          batch.push(updateHist(hist, data));
        });
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
      this[typeNameToDeleteFieldName(typeName)] = (where) => {
        let hist = database.whereInput(where);
        return deleteHist(hist);
      };
      this[typeNameToDeleteManyFieldName(typeName)] = ({ where, orderBy }) => {
        let hists = database.whereInput(typeName, where, orderBy).hists;
        let batch = [];
        hists.forEach((hist) => {
          batch.push(deleteHist(hist));
        });
        return batchPayload(batch, 1);
      };
      this[typeNameToRestoreFieldName(typeName)] = (where) => {
        let hist = database.whereInput(where);
        return restoreHist(hist);
      };
      this[typeNameToRestoreManyFieldName(typeName)] = ({ where, orderBy }) => {
        let hists = database.whereInput(typeName, where, orderBy).hists;
        let batch = [];
        hists.forEach((hist) => {
          batch.push(restoreHist(hist));
        });
        return batchPayload(batch);
      };
    });
  }
}
