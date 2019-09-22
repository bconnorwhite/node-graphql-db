import {
  returnTypeToTypeName,
  returnTypeUnrequire
} from '../../utils';

export default (datamodel, typeName) => {
  let type = datamodel[typeName];
  return Object.keys(type).reduce((retval, fieldName) => {
    if(type[fieldName].managed !== true) {
      let fieldTypeName = returnTypeToTypeName(type[fieldName].type);
      if(type) {

      } else { //field
        retval[fieldName] = {
          type: returnTypeUnrequire(type[fieldName].type)
        };
      }
    }
    return retval;
  }, {});
}
