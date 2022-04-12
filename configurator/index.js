import prompts from "prompts";
import fs from "fs/promises";
import child_process from "child_process";
import crypto from "crypto";
import process from "process";
import { pipeline, Transform } from "stream";

class Label extends Transform {
  constructor(label) {
    super();
    this.label = label;
    this.td = new TextDecoder();
  }

  _transform(chunk, encoding, callback) {
    callback(
      null,
      this.td.decode(chunk).replace(/(.*\n)/g, this.label + ":\t$1")
    );
  }
}

const backends = await fs.readdir("../backends");
const { backend } = await prompts({
  type: "select",
  name: "backend",
  message: "Pick a backend",
  choices: backends.map((value) => ({ value })),
});
if (!backend) process.exit();
const backendMetadataFile = await fs.readFile(
  `../backends/${backend}/metadata.json`
);
const backendMetadata = JSON.parse(backendMetadataFile);

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

child_process.execSync(backendMetadata.install, {
  cwd: `../backends/${backend}`,
});
child_process.execSync(databaseMetadata.installer, {
  cwd: `../backends/${backend}`,
});
child_process.execSync("yarn install", {
  cwd: `../frontends/${frontend}`,
});
child_process.execSync(`yarn add ../../clients/${backendMetadata.client}`, {
  cwd: `../frontends/${frontend}`,
});
child_process.execSync(`yarn add ../../themes/${theme}`, {
  cwd: `../frontends/${frontend}`,
});

const pass = crypto.randomUUID();

if (databaseMetadata.start) {
  const [databaseStart, ...databaseArgs] = databaseMetadata.start
    .replace("$DB_PASS", pass)
    .split(" ");
  const databaseProcess = child_process.spawn(databaseStart, databaseArgs, {
    cwd: `../databases/${backendMetadata.language}/${database}`,
    shell: true,
  });
  pipeline(
    databaseProcess.stdout,
    new Label("Database"),
    process.stdout,
    (err) => {
      if (err) console.error(err);
    }
  );
  pipeline(
    databaseProcess.stderr,
    new Label("Database"),
    process.stdout,
    (err) => {
      if (err) console.error(err);
    }
  );
}

const [backendStart, ...backendArgs] = backendMetadata.start.split(" ");
const backendProcess = child_process.spawn(backendStart, backendArgs, {
  cwd: `../backends/${backend}`,
  env: { ...process.env, DB_PASS: pass },
  shell: true,
});
pipeline(backendProcess.stdout, new Label("Backend"), process.stdout, (err) => {
  if (err) console.error(err);
});
pipeline(backendProcess.stderr, new Label("Backend"), process.stdout, (err) => {
  if (err) console.error(err);
});

const [frontendStart, ...frontendArgs] = frontendMetadata.start.split(" ");
const frontendProcess = child_process.spawn(frontendStart, frontendArgs, {
  cwd: `../frontends/${frontend}`,
  shell: true,
});
pipeline(
  frontendProcess.stdout,
  new Label("Frontend"),
  process.stdout,
  (err) => {
    if (err) console.error(err);
  }
);
pipeline(
  frontendProcess.stderr,
  new Label("Frontend"),
  process.stdout,
  (err) => {
    if (err) console.error(err);
  }
);
