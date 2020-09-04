import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { GraphQLUpload } from 'graphql-upload';

function uploadType(name: string, mimetype: string) {
  let upload = Object.assign({}, GraphQLUpload);
  upload.parseValue = (value) => {
    return value.then((file) => {
      if(value.mimetype == mimetype) {
        return value;
      } else {
        throw new Error(`\`${name}\` scalar does not support mimetype \`${value.mimetype}\`.`)
      }
    });
  };
  return upload;
}

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types

export default {
  CSS: uploadType("BIN", "text/css"),
  CSV: uploadType("CSV", "text/csv"),
  GIF: uploadType("GIF", "image/gif"),
  JPEG: uploadType("JPG", "image/jpeg"),
  JPG: uploadType("JPG", "image/jpg"),
  JS: uploadType("JS", "text/javascript"),
  JSON: uploadType("JSON", "application/json"),
  PNG: uploadType("PNG", "image/png"),
  PDF: uploadType("PDF", "application/pdf"),
  SVG: uploadType("SVG", "image/svg+xml"),
  TXT: uploadType("TXT", "text/plain"),
  ZIP: uploadType("ZIP", "application/zip")
}
