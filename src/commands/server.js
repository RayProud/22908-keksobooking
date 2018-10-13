const http = require(`http`);
const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const readfile = promisify(fs.readFile);
const {extname, join} = require(`path`);

const hostname = `127.0.0.1`;

function getContentTypePath(path) {
  const extsMap = {
    css: `text/css`,
    html: `text/html; charset=UTF-8`,
    jpg: `image/jpeg`,
    jpeg: `image/jpeg`,
    png: `image/png`,
    svg: `image/svg+xml`,
    ico: `image/x-icon`,
  };

  // extension is with a leading dot
  const ext = extname(path).slice(1);

  return extsMap[ext] || `text/plain`;
}

function resolveFileAddress(pathname) {
  let address = `${__dirname}../../../static`;

  switch (pathname) {
    case `/`:
      address += `/index.html`;
      break;
    default:
      address += pathname;
  }

  return join(address);
}

const readFile = async (path, res) => {
  const data = await readfile(path);
  res.setHeader(`content-type`, getContentTypePath(path));
  res.end(data);
};

const server = http.createServer((req, res) => {
  const {pathname} = url.parse(req.url);

  (async () => {
    try {
      const fileAddress = resolveFileAddress(pathname);

      res.statusCode = 200;
      res.statusMessage = `OK`;

      await readFile(fileAddress, res);
    } catch (err) {
      res.writeHead(404, `Not Found`);
      res.end();
    }
  })().catch((err) => {
    res.writeHead(500, err.message, {
      'content-type': `text/plain`,
    });

    res.end(err.message);
  });
});

module.exports = {
  name: `server`,
  description: `Runs the server`,
  execute(port = `3000`) {
    if (!isNumeric(port)) {
      console.warn(colors.yellow(`'port' argument should be a number. The server will try listen on 3000.`));
    }

    server.listen(port, hostname, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(colors.green(`The server is listening on ${port}`));
    });
  }
};
