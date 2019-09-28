import { DatabaseTable } from './';

export default (table: DatabaseTable, where: object) => {
  let fields = Object.keys(where);
  if(fields.length > 1) {
    throw new Error("You provided more than one field for the unique selector on Install. If you want that behavior you can use the many query and combine fields with AND / OR.");
  } else {
    let fieldName = fields[0];
    if(fieldName == "uuid") {
      return table[where["uuid"]];
    } else {
      let uuid = Object.keys(table).find((uuid) => {
        let node = table[uuid];
        if(node) {
          return node[fieldName] == where[fieldName];
        }
      });
      if(uuid) {
        return table[uuid];
      }
    }
  }
}
