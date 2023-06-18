import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const buildPath = (collection: string) => {
  const filepath = path.join(process.cwd(), "db", collection + ".json");

  // if the file does not exist, create one with `[]` as the content
  if (!existsSync(filepath)) {
    console.log(filepath + " does not exist");
    writeFileSync(filepath, JSON.stringify([]));
  }

  return filepath;
};

export const find = (collection: string) => {
  const filepath = buildPath(collection);
  const contents = readFileSync(filepath);

  return JSON.parse(contents.toString());
};

export const insert = (collection: string, data: Record<string, unknown>) => {
  const contents = find(collection);
  const filepath = buildPath(collection);

  contents.push({ id: Date.now(), ...data });
  writeFileSync(filepath, JSON.stringify(contents));

  return data;
};
