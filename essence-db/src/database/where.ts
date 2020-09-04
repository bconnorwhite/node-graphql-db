import { InputType } from './datamodel/inputs';
import { Node, DatabaseTable } from './';

export interface WhereInputArgs extends PagingArgs {
  where?: object
  orderBy?: string
}

export interface PagingArgs {
  skip?: number,
  after?: string,
  before?: string,
  first?: number,
  last?: number
}

// Paging: https://facebook.github.io/relay/graphql/connections.htm#sec-Pagination-algorithm
function page(nodes: Node[], { skip, after, before, first, last }: PagingArgs) {
  let hasNextPage = false;
  let hasPreviousPage = false;
  // Before && After
  if(after) {
    let index = nodes.findIndex((node) => node.uuid == after);
    if(index > -1) {
      hasPreviousPage = true;
      nodes = nodes.slice(index+1);
    } else {
      nodes = [];
    }
  }
  if(before) {
    let index = nodes.findIndex((node) => node.uuid == before);
    if(index > -1) {
      hasNextPage = true;
      nodes = nodes.slice(0, index);
    } else {
      nodes = [];
    }
  }
  // Skip
  nodes = nodes.slice(skip);
  // First & Last
  if(first && first > 0) {
    if(first < nodes.length) {
      hasNextPage = true;
    }
    nodes = nodes.slice(0, first);
  }
  if(last && last > 0) {
    if(last < nodes.length) {
      hasPreviousPage = true;
    }
    nodes = nodes.slice(nodes.length - last);
  }
  return {
    nodes: nodes,
    hasNextPage,
    hasPreviousPage
  }
}

function orderByInput(nodes: Node[], orderBy: string) {
  let index = orderBy.lastIndexOf("_");
  let direction = (["ASC", "DESC"].indexOf(orderBy.slice(index + 1)) * 2)-1;
  let dirA = direction;
  let dirB = direction * -1;
  let field = orderBy.slice(0, index);
  return nodes.sort((nodeA, nodeB) => {
    return nodeA[field] > nodeB[field] ? dirA : dirB;
  });
}

function filterWhere(node: Node, where: object={}, inputType: InputType) {
  let retval = true;
  Object.keys(where).forEach((fieldName) => {
    if(fieldName == "AND") {
      let andRetVal = true;
      where[fieldName].forEach((andWhereInput: object) => {
        andRetVal = andRetVal && filterWhere(node, andWhereInput, inputType);
      });
      retval = retval && andRetVal;
    } else if(fieldName == "OR") {
      let orRetVal = false;
      where[fieldName].forEach((orWhereInput: object) => {
        orRetVal = orRetVal || filterWhere(node, orWhereInput, inputType);
      });
      retval = retval && orRetVal;
    } else if(fieldName == "NOT") {
      let notRetVal = true;
      where[fieldName].forEach((notWhereInput: object) => {
        notRetVal = notRetVal && !filterWhere(node, notWhereInput, inputType);
      });
      retval = retval && notRetVal;
    } else if(inputType[fieldName].filter !== undefined) {
      retval = retval && inputType[fieldName].filter(node, where[fieldName]);
    }
  });
  return retval;
}

export default (table: DatabaseTable, inputType: InputType, args: WhereInputArgs) => {
  let uuids = Object.keys(table);
  if(args.where) {
    uuids = uuids.filter((uuid) => {
      let node = table[uuid];
      if(node) {
        return filterWhere(node, args.where, inputType);
      }
    });
  }
  let nodes = uuids.map((uuid) => table[uuid]);
  if(args.orderBy) {
    nodes = orderByInput(nodes, args.orderBy);
  }
  return page(nodes, args);
}
