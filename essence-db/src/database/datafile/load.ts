import fs from 'fs';
import { retrocycle } from 'json-cycle';
import { expand } from 'weissman-json';

export default(data: object, path: string, { compress }) => {
  try {
    let string = fs.readFileSync(path, 'utf8');
    if(string !== "") {
      let json = JSON.parse(string);
      if(compress) {
        json = expand(json);
      }
      return retrocycle(json);
    } else {
      return data;
    }
  } catch(err) {
    console.log(err);
  }
}
