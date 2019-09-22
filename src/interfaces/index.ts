
export enum Action {
  get,
  getHistory,
  getMany,
  getManyHistory,
  getConnection,
  create,
  update,
  updateMany,
  upsert,
  delete,
  deleteMany,
  restore,
  restoreMany
}

export interface Args {
  [index: string]: string
}

export interface Input {
  [index: string]: {
    type: string,
    filter?: (node: any, value: string)=>boolean
  }
}

export interface InputList {
  [index: string]: Input
}

export interface Type {
  [index: string]: {
    type: string,
    unique?: Boolean,
    args?: Args,
    action?: Action,
    managed?: Boolean
  }
}

export interface TypeList {
  [index: string]: Type
}

export interface EnumList {
  [index: string]: string[]
}

export interface DatabaseInterface {
  init: ()=>void,
  load: ()=>number,
  save: ()=>number,
  drop: ()=>number,
  stats: ()=>any,
  generateUUID: ()=>string,
  data: {
    [index: string]: {
      [index: string]: Object[]
    }
  },
  whereUniqueInput: (typeName: string, where:any)=>any,
  whereInput: (typeName: string, where?: any, orderBy?: any, skip?: number, after?: string, before?: string, first?: number, last?: number)=>any
}

export interface DatabaseOptions {
  log?: Boolean,
  pretty?: Boolean,
  compress?: Boolean,
  watch?: Boolean
}

export interface Resolvers {
  [index: string]: {
    [index: string]: any
  }
}
