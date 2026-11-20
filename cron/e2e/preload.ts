import Module from "node:module";
import path from "node:path";


type ResolveFilename = (
  this: unknown,
  request: string,
  parent: { filename?: string } | null | undefined,
  isMain: boolean,
  options?: object,
) => string;

const moduleApi = Module as unknown as { _resolveFilename: ResolveFilename };
const resolveFilename = moduleApi._resolveFilename;

moduleApi._resolveFilename = function (request, parent, isMain, options) {
  const fromHtmlEmail =
    parent?.filename?.endsWith(`${path.sep}utils${path.sep}htmlEmail.js`) ===
    true;
  if (fromHtmlEmail && request === "../config/config") {
    return path.join(__dirname, "..", "config", "config.js");
  }
  return resolveFilename.call(this, request, parent, isMain, options);
};
