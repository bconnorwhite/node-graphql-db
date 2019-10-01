import uuid from 'uuid/v4';
import { applyPatch } from 'fast-json-patch';
import { decycle, retrocycle } from 'json-cycle';

import { typeNameToWhereInput } from 'utils';

import where, { WhereInputArgs } from './where';
import whereUnique from './whereUnique';
import create from './create';
import commit, { Commit } from './commit';

import Datamodel, { ModelList } from './datamodel';
import Datafile, { DatafileOptions } from './datafile';
import { PatchList } from './commit';

export type DatabaseOptions = {
  directory?: string,
  watch?: boolean,
  fileOptions?: DatafileOptions
}

export type DatabaseData = {
  [index: string]: DatabaseType
}

export type DatabaseType = {
  nodes: DatabaseIndex,
  patches: {
    [index: string]: PatchList
  }
}

export type DatabaseIndex = {
  [index: string]: DatabaseTable
}

export type DatabaseTable = {
  [index: string]: Node
}

export type Node = {
  uuid: string,
  createdAt: string,
  updatedAt: string,
  [index: string]: FieldValue
}

export type FieldValue = (string | number | boolean | TypeFieldValue);

export type TypeFieldValue = (null | Node | Node[]);

export default class Database {
  datamodel: Datamodel;
  datafile: Datafile;
  private data: DatabaseData = {};
  private options: DatabaseOptions;
  constructor(datamodel: ModelList, options: DatabaseOptions={}) {
    this.options = {
      directory: options.directory || `${process.env.PWD}/store/graph/`,
      watch: options.watch || false,
      fileOptions: {
        log: (options.fileOptions && options.fileOptions.log == undefined) || (options.fileOptions && options.fileOptions.log),
        pretty: (options.fileOptions && options.fileOptions.pretty) || false,
        compress: (options.fileOptions && options.fileOptions.compress == undefined) || (options.fileOptions && options.fileOptions.compress)
      }
    };
    this.datamodel = new Datamodel(datamodel);
    this.datafile = new Datafile(this.options.directory + "db.json", this.options.fileOptions);
    this.init();
    if(this.options.watch) {
      this.watch();
    }
    process.on('SIGINT', ()=>{
      console.log();
      this.save();
      process.exit();
    });
  }
  private init() {
    this.datamodel.baseTypeNames.forEach((typeName) => {
      this.data[typeName] = this.data[typeName] || {
        nodes: {
          uuid: {}
        },
        patches: {}
      };
    });
    this.load(this.data);
  }
  private watch() {
    this.datafile.watch(()=>this.load());
  }
  load(data?: DatabaseData) {
    let load = this.datafile.load(data);
    this.data = load.data;
    return load.elapsed;
  }
  save() {
    let save = this.datafile.save(this.data);
    return save.elapsed;
  }
  drop() {
    let drop = this.datafile.drop();
    this.init();
    return drop.elapsed;
  }
  stats() {
    return this.datafile.stats();
  }
  private generateUUID(typeName?: string) {
    let id: string;
    do {
      id = uuid();
    } while(typeName && this.data[typeName][id] !== undefined);
    return id;
  }
  generateNode(typeName: string) {
    let date = new Date().toISOString();
    return {
      uuid: this.generateUUID(typeName),
      createdAt: date,
      updatedAt: date
    }
  }
  private getType(typeName: string) {
    return this.data[typeName];
  }
  private getTable(typeName: string, index: string="uuid") {
    return this.data[typeName].nodes[index];
  }
  private getHist(typeName: string, node: Node) {
    let patches = this.data[typeName].patches[node.uuid];
    let hist = [node];
    patches.forEach((patch) => {
      hist.push(retrocycle(applyPatch(decycle(Object.assign({}, node)), patch, undefined, false).newDocument));
    });
    return hist;
  }
  private commit(patches: Commit) {
    this.data = commit(this.data, patches);
  }
  getTypeModel(typeName: string) {
    return this.datamodel.model[typeName];
  }
  getFieldModel(typeName: string, fieldName: string) {
    return this.datamodel.model[typeName][fieldName];
  }
  whereUnique(typeName: string, where: object) {
    let table = this.getTable(typeName);
    return whereUnique(table, where);
  }
  whereUniqueHist(typeName: string, where: object) {
    let node = this.whereUnique(typeName, where);
    if(node) {
      return this.getHist(typeName, node);
    }
  }
  where(typeName: string, args: WhereInputArgs={}) {
    let table = this.getTable(typeName);
    let inputType = this.datamodel.inputs[typeNameToWhereInput(typeName)];
    return where(table, inputType, args);
  }
  whereHist(typeName: string, args: WhereInputArgs={}) {
    let result = this.where(typeName, args);
    return result.nodes.map((node) => ({
      nodes: this.getHist(typeName, node),
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage
    }));
  }
  create(typeName: string, data: object) {
    let result = create(this, typeName, data);
    if(result) {
      this.commit(result.commit);
      return result.node;
    } else {
      return null;
    }
  }
}
