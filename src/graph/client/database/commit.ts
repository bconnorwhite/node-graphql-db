import { applyPatch, AddOperation, RemoveOperation, ReplaceOperation } from 'fast-json-patch';

import { DatabaseData, Node, FieldValue } from './';

export type PatchList = Patch[];

export declare type Operation = AddOperation<FieldValue> | RemoveOperation | ReplaceOperation<FieldValue>;

export type Patch = Operation[];

export type Commit = CommitOperation[];

export interface CommitOperation {
  node: Node,
  typeName: string
  operation: Operation
}

function reverse(patch: Patch, removed: FieldValue[]) {
  return patch.map((operation, index) => {
    if(operation.op == "add") {
      return { op: "remove", path: operation.path };
    } else if(operation.op == "remove") {
      return { op: "add", path: operation.path, value: removed[index] };
    } else if(operation.op == "replace") {
      return { op: "replace", path: operation.path, value: removed[index] };
    }
  });
}

function commitToPatch(commit: Commit) {
  return commit.map((commit) => ({
    op: commit.operation.op,
    path: `${commit.typeName}/nodes/${commit.node.uuid}${commit.operation.path}`,
    value: commit.operation.value
  }));
}

export default (data: DatabaseData, commit: Commit) => {
  let patch = commitToPatch(commit);
  let result = applyPatch(data, patch);
  let patches = {};
  commit.forEach((item, index) => {
    patches[item.typeName] = patches[item.typeName] || {};
    patches[item.typeName][item.node.uuid] = patches[item.typeName][item.node.uuid] || [];
    patches[item.typeName][item.node.uuid].push(patch[index]);
  });
  let retval = result.newDocument;
  Object.keys(patches).forEach((typeName) => {
    Object.keys(patches[typeName]).forEach((uuid) => {
      retval[typeName].patches[uuid] = retval[typeName].patches[uuid] || [];
      retval[typeName].patches[uuid].unshift(patches[typeName][uuid]);
    });
  });
  return retval;
}








//space
