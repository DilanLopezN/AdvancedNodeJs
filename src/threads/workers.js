"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const startDate = Date.now();
const { id, filePath, start: startByte, end: endByte } = node_worker_threads_1.workerData;
console.log(`Iniciando THREAD ${id}`);
const stream = node_fs_1.default.createReadStream(filePath, {
    start: startByte,
    end: endByte
});
const rl = node_readline_1.default.createInterface({
    input: stream
});
rl.on('line', line => {
    try {
        const obj = JSON.parse(line);
        // processa aqui, por exemplo:
        console.log(`[THREAD ${id}] Nome do item:`, obj.name);
    }
    catch (err) {
        console.error(`[THREAD ${id}] Erro ao parsear linha:`, line);
    }
});
rl.on('close', () => {
    const endDate = Date.now();
    console.log(`THREAD ${id} terminou o processamento.`);
    if (node_worker_threads_1.parentPort) {
        node_worker_threads_1.parentPort.postMessage({
            id: id,
            time: endDate - startDate
        });
    }
});
