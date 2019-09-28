import fs from 'fs';

export default (path: string) => {
  try {
    fs.writeFileSync(path, "");
    return {};
  } catch(err) {
    console.error(err);
  }
}
