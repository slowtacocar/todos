import prompts from "prompts";
import fs from "fs/promises";
import child_process from "child_process";

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

child_process.execSync(databaseMetadata.installer, {
  cwd: `../backends/${backend}`,
});

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

child_process.execSync(`yarn add ../../clients/${backendMetadata.client}`, {
  cwd: `../frontends/${frontend}`,
});

const [backendStart, ...backendArgs] = backendMetadata.start.split(" ");
const backendProcess = child_process.spawn(backendStart, backendArgs, {
  cwd: `../backends/${backend}`,
});
backendProcess.stdout.setEncoding("utf-8");
backendProcess.stderr.setEncoding("utf-8");
backendProcess.stdout.on("data", (data) => {
  console.log("Backend: " + data);
});
backendProcess.stderr.on("data", (data) => {
  console.error("Backend: " + data);
});

const [frontendStart, ...frontendArgs] = frontendMetadata.start.split(" ");
const frontendProcess = child_process.spawn(frontendStart, frontendArgs, {
  cwd: `../frontends/${frontend}`,
});
frontendProcess.stdout.on("data", (data) => {
  console.log("Frontend: " + data);
});
frontendProcess.stderr.on("data", (data) => {
  console.error("Frontend: " + data);
});
