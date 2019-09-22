const path = require('path');
const fs = require('fs');
import { retrocycle as retrocycleJSON, decycle as decycleJSON } from 'json-cycle';
import { compress as compressJSON, expand as expandJSON } from 'weissman-json';

import { DatabaseInterface, DatabaseOptions, TypeList, InputList } from '../interfaces';
import elapsed from '../elapsed';

function load(data, path, { compress }) {
  try {
    let string = fs.readFileSync(path, 'utf8');
    if(string !== "") {
      let json = JSON.parse(string);
      if(compress) {
        json = expandJSON(json);
      }
      return retrocycleJSON(json);
    } else {
      return data;
    }
  } catch(err) {
    console.log(err);
  }
}

function save(data, path, { compress, pretty }) {
  try {
    let json = decycleJSON(data);
    if(compress) {
      json = compressJSON(json);
    }
    let string = pretty ? JSON.stringify(json, null, 2) : JSON.stringify(json);
    fs.writeFileSync(path, string);
  } catch(err) {
    console.error(err);
  }
}

function drop(path) {
  try {
    fs.writeFileSync(path, "");
    return {};
  } catch(err) {
    console.error(err);
  }
}

const db = path.normalize(__dirname + "../../../../store/graph/db.json");

export default class Database implements DatabaseInterface {
  data;
  typeList: TypeList;
  inputList: InputList;
  options: DatabaseOptions;
  client;
  constructor(typeList: TypeList, inputList: InputList, options: DatabaseOptions) {
    this.typeList = typeList;
    this.inputList = inputList;
    this.options = {
      log: options.log == undefined || options.log,
      pretty: options.pretty || false,
      compress: options.compress == undefined || options.compress,
      watch: options.watch || false
    };
    this.init();
    if(this.options.watch) {
      this.watch();
    }
  }
  init() {
    this.data = { Node: {} };
    Object.keys(this.typeList).forEach((typeName) => {
      this.data[typeName] = this.data[typeName] || {};
    });
    this.load();
  }
  watch() {
    fs.watch(db, (eventType: string) => {
      if(eventType == "change") {
        this.load();
      }
    });
  }
  load() {
    let dt;
    this.data = elapsed(()=>load(this.data, db, {
      compress: this.options.compress
    }), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({
          message: "database loaded",
          elapsed: delta
        });
      }
    });
    return dt;
  }
  save() {
    let dt;
    elapsed(()=>save(this.data, db, {
      compress: this.options.compress,
      pretty: this.options.pretty
    }), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({
          message: "database saved",
          elapsed: delta
        });
      }
    });
    return dt;
  }
  drop() {
    let dt;
    this.data = elapsed(()=>drop(db), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({
          message: "database dropped",
          elapsed: delta
        });
      }
    });
    this.init();
    return dt;
  }
  stats() {
    return new Promise((resolve) => {
      fs.stat(db, (err, stats) => {
        if(err) {
          console.error(err);
          throw new Error("Cannot read database stats");
        } else {
          resolve({
            size: stats.size
          });
        }
      });
    });
  }
  generateUUID() {
    let uuid;
    do {
      let date = new Date().getTime();
      uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (char) => {
        let rand = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        return (char=='x' ? rand :(rand&0x3|0x8)).toString(16);
      });
    } while(this.data.Node[uuid] !== undefined);
    return uuid;
  }
  whereUniqueInput(typeName: string, where: any, includeDeleted: Boolean=false) {
    let fields = Object.keys(where);
    if(fields.length > 1) {
      throw new Error("You provided more than one field for the unique selector on Install. If you want that behavior you can use the many query and combine fields with AND / OR.");
    } else {
      let fieldName = fields[0];
      if(fieldName == "uuid") {
        return this.data[typeName][where.uuid];
      } else {
        let uuid = Object.keys(this.data[typeName]).find((uuid) => {
          let hist = this.data[typeName][uuid];
          if(hist && hist.length > 0) {
            let node = this.data[typeName][uuid][0];
            if(node == null && includeDeleted && hist.length > 1) {
              node = hist[1];
            }
            if(node) {
              return node[fieldName] == where[fieldName];
            }
          }
        });
        if(uuid) {
          return this.data[typeName][uuid];
        }
      }
    }
  }
  whereInput(typeName: string, where?: any, orderBy?: any, skip?: number, after?: string, before?: string, first?: number, last?: number) {
    let table = this.data[typeName];
    let uuids = Object.keys(table);
    // Where
    if(where) {
      uuids = uuids.filter((uuid) => {
        let node = table[uuid][0];
        function filterWhereInput(whereInput: any) {
          let retval = true;
          Object.keys(whereInput).forEach((key) => {
            if(key == "AND") {
              let andRetVal = true;
              whereInput[key].forEach((andWhereInput) => {
                andRetVal = andRetVal && filterWhereInput(andWhereInput);
              });
              retval = retval && andRetVal;
            } else if(key == "OR") {
              let orRetVal = false;
              whereInput[key].forEach((orWhereInput) => {
                orRetVal = orRetVal || filterWhereInput(orWhereInput);
              });
              retval = retval && orRetVal;
            } else if(key == "NOT") {
              let notRetVal = true;
              whereInput[key].forEach((notWhereInput) => {
                notRetVal = notRetVal && !filterWhereInput(notWhereInput);
              });
              retval = retval && notRetVal;
            } else {
              retval = retval && this.inputList[`${typeName}WhereInput`][key].filter(node, whereInput[key]);
            }
          });
          return retval;
        }
        return filterWhereInput(where);
      });
    }
    let items = uuids.map((uuid) => table[uuid]);
    // OrderBy
    if(orderBy) {
      let index = orderBy.lastIndexOf("_");
      let direction = (["ASC", "DESC"].indexOf(orderBy.slice(index + 1)) * 2)-1;
      let dirA = direction;
      let dirB = direction * -1;
      let field = orderBy.slice(0, index);
      items = items.sort((histA, histB) => {
        let nodeA = histA[0];
        if(nodeA) {
          let nodeB = histB[0];
          if(nodeB) {
            return histA[0][field] > histB[0][field] ? dirA : dirB;
          } else {
            return dirB;
          }
        } else {
          return dirA;
        }
      });
    }
    // Paging: https://facebook.github.io/relay/graphql/connections.htm#sec-Pagination-algorithm
    let hasNextPage = false;
    let hasPreviousPage = false;
    // Before && After
    if(after) {
      let index = uuids.indexOf(after);
      if(index > -1) {
        hasPreviousPage = true;
        uuids = uuids.slice(index+1); //slice for before
        items = items.slice(index+1);
      } else {
        items = [];
      }
    }
    if(before) {
      let index = uuids.indexOf(before);
      if(index > -1) {
        hasNextPage = true;
        items = items.slice(0, index);
      } else {
        items = [];
      }
    }
    // Skip
    items = items.slice(skip);
    // First & Last
    if(first && first > 0) {
      if(first < items.length) {
        hasNextPage = true;
      }
      items = items.slice(0, first);
    }
    if(last && last > 0) {
      if(last < items.length) {
        hasPreviousPage = true;
      }
      items = items.slice(items.length - last);
    }
    return {
      hists: items,
      hasNextPage,
      hasPreviousPage
    }
  }
}
