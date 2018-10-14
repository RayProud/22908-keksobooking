const http = require(`http`);
const colors = require(`colors`);
const {isNumeric} = require(`../helpers/common`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const readfile = promisify(fs.readFile);
const {extname, normalize} = require(`path`);

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

  return normalize(address);
}

const sendFile = async (path, res) => {
  const data = await readfile(path);
  res.setHeader(`content-type`, getContentTypePath(path));
  res.end(data);
};

const server = http.createServer(async (req, res) => {
  try {
    const {pathname} = url.parse(req.url);
    const fileAddress = resolveFileAddress(pathname);

    res.statusCode = 200;
    res.statusMessage = `OK`;

    await sendFile(fileAddress, res);
  } catch (err) {
    if (err.code === `ENOENT`) {
      res.writeHead(404, `Not Found`);
      res.end();
      return;
    }

    res.writeHead(500, err.message, {
      [`content-type`]: `text/plain`,
    });
    res.end(err.message);
  }
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
