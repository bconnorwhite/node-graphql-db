import fs from 'fs';
import { decycle } from 'json-cycle';
import { compress as compressJSON } from 'weissman-json';

export default (data: object, path: string, { compress, pretty }) => {
  try {
    let json = decycle(data);
    if(compress) {
      json = compressJSON(json);
    }
    let string = pretty ? JSON.stringify(json, null, 2) : JSON.stringify(json);
    fs.writeFileSync(path, string);
  } catch(err) {
    console.error(err);
  }
}
