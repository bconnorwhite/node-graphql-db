import {
  returnTypeToTypeName,
  returnTypeUnrequire,
  returnTypeIsList
} from '../../utils';

export default (datamodel, typeName) => {
  let type = datamodel[typeName];
  return Object.keys(datamodel[typeName]).reduce((retval, fieldName) => {
    if(type[fieldName].managed !== true && type[fieldName].unique !== true && !returnTypeIsList(typeName)) {
      let fieldTypeName = returnTypeToTypeName(type[fieldName].type);
      if(type) { //type

      } else { //field
        retval[fieldName] = {
          type: returnTypeUnrequire(type[fieldName].type)
        };
      }
    }
    return retval;
  }, {});
}
