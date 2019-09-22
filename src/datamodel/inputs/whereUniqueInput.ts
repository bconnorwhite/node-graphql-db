import {
  returnTypeToTypeName,
} from '../../utils';

export default (datamodel, typeName) => {
  let type = datamodel[typeName];
  return Object.keys(type).filter((fieldName) => type[fieldName].unique).reduce((retval, fieldName) => {
    retval[fieldName] = {
      type: returnTypeToTypeName(type[fieldName].type)
    };
    return retval;
  }, {});
}
