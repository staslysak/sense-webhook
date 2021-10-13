## Docker build & run

@todo add `{npm run vault &&}` to prestart script

to start container run `{./bin/deploy $VAULT_HOST $VAULT_USER $VAULT_PW}`

replace `{$VAULT_HOST $VAULT_USER $VAULT_PW}` with your credentials


const fs = require("fs");
const fsExtra = require("fs-extra");
const archiver = require("archiver");

async function zip(filename = "build.zip", source = "build/") {
  const archive = archiver("zip");
  const output = fs.createWriteStream(filename);

  // output.on("close", () => {
  //   console.log(`${archive.pointer()} total bytes size ${filename}.`);
  // });

  // archive.on("error", (err) => {
  //   throw err;
  // });

  archive.pipe(output);
  return archive
    .directory(source, false)
    .finalize()
    .then(() => {
      console.log(`${archive.pointer()} total bytes size ${filename}.`);
    });
}

async function exec() {
  fsExtra.copySync("./copy-from", "./build");
  await zip();
  console.log("finish");
}

exec();
