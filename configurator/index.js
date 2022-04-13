import prompts from "prompts";
import fs from "fs/promises";
import child_process from "child_process";
import crypto from "crypto";
import process from "process";
import { Transform } from "stream";
import { setTimeout } from "timers/promises";

const controller = new AbortController();

class Label extends Transform {
  constructor(label) {
    super();
    this.label = label;
    this.td = new TextDecoder();
  }

  _transform(chunk, encoding, callback) {
    callback(null, this.td.decode(chunk));
  }
}

function spawn(command, cwd, label, env) {
  const [start, ...args] = command.split(" ");
  const child = child_process.spawn(start, args, {
    cwd,
    env: env && { ...process.env, ...env },
    shell: true,
    signal: controller.signal,
  });
  child.stdout.pipe(new Label(label)).pipe(process.stdout, { end: false });
  child.stderr.pipe(new Label(label)).pipe(process.stdout, { end: false });
  child.on("close", () => {
    controller.abort();
  });
}

const backends = await fs.readdir("../backends");
const backendMetadataFiles = await Promise.all(
  backends.map((backend) => fs.readFile(`../backends/${backend}/metadata.json`))
);
const backendMetadatas = backendMetadataFiles.map((file) => JSON.parse(file));
const { backendIndex } = await prompts({
  type: "select",
  name: "backendIndex",
  message: "Pick a backend",
  choices: backends.map((value, index) => ({
    title: value,
    description: backendMetadatas[index].description,
  })),
});
if (backendIndex == null) process.exit();
const backend = backends[backendIndex];
const backendMetadata = backendMetadatas[backendIndex];

const databases = await fs.readdir(`../databases/${backendMetadata.language}`);
const { database } = await prompts({
  type: "select",
  name: "database",
  message: "Pick a database",
  choices: databases.map((value) => ({ value })),
});
if (!database) process.exit();
const databaseMetadataFile = await fs.readFile(
  `../databases/${backendMetadata.language}/${database}/metadata.json`
);
const databaseMetadata = JSON.parse(databaseMetadataFile);

const frontends = await fs.readdir("../frontends");
const { frontend } = await prompts({
  type: "select",
  name: "frontend",
  message: "Pick a frontend",
  choices: frontends.map((value) => ({ value })),
});
if (!frontend) process.exit();
const frontendMetadataFile = await fs.readFile(
  `../frontends/${frontend}/metadata.json`
);
const frontendMetadata = JSON.parse(frontendMetadataFile);

const themes = await fs.readdir("../themes");
const { theme } = await prompts({
  type: "select",
  name: "theme",
  message: "Pick a theme",
  choices: themes.map((value) => ({ value })),
});
if (!theme) process.exit();

console.log("Installing database connector...");
child_process.execSync(databaseMetadata.installer, {
  cwd: `../backends/${backend}`,
});
console.log("Installing backend dependencies...");
child_process.execSync(backendMetadata.install, {
  cwd: `../backends/${backend}`,
});
console.log("Installing API connector...");
child_process.execSync(`yarn add ../../clients/${backendMetadata.client}`, {
  cwd: `../frontends/${frontend}`,
});
console.log("Installing CSS theme...");
child_process.execSync(`yarn add ../../themes/${theme}`, {
  cwd: `../frontends/${frontend}`,
});
console.log("Installing frontend dependencies...");
child_process.execSync("yarn install", {
  cwd: `../frontends/${frontend}`,
});

const pass = crypto.randomUUID();

if (databaseMetadata.start) {
  console.log("Starting database container...");
  spawn(
    databaseMetadata.start.replace("$DB_PASS", pass),
    `../databases/${backendMetadata.language}/${database}`,
    "DATABASE"
  );
  await setTimeout(10000, null, { signal: controller.signal });
}
spawn(backendMetadata.start, `../backends/${backend}`, "BACKEND", {
  DB_PASS: pass,
});
spawn(frontendMetadata.start, `../frontends/${frontend}`, "FRONTEND");
