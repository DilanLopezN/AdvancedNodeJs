"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const node_worker_threads_1 = require("node:worker_threads");
const node_os_1 = __importDefault(require("node:os"));
if (node_worker_threads_1.isMainThread) {
    const threads = Number(process.argv[2]);
    const prefix = process.argv[3];
    const input = process.argv.slice(4).join(' ');
    const numCPUs = node_os_1.default.cpus().length;
    if (threads > numCPUs)
        throw new Error('excedendo nº máximo de threads');
    const workers = [];
    for (let index = 0; index < threads; index++) {
        const worker = new node_worker_threads_1.Worker(__filename, {
            workerData: { prefix, input }
        });
        worker.on('message', message => {
            if (message == 'END') {
                workers
                    .filter(diferrenteWorker => diferrenteWorker !== worker)
                    .forEach(diferrenteWorker => diferrenteWorker.terminate());
            }
        });
        workers.push(worker);
    }
}
else {
    let nonce;
    let hash;
    do {
        nonce = `${Math.random().toFixed(10).substring(2)}${Math.random()
            .toFixed(10)
            .substring(2)}`;
        hash = (0, node_crypto_1.createHash)('sha256')
            .update(`${node_worker_threads_1.workerData.input}${nonce}`)
            .digest('hex');
        console.log(`Input: ${node_worker_threads_1.workerData.input} / Nonce ${nonce} / Hash ${hash}`);
    } while (!hash.startsWith(node_worker_threads_1.workerData.prefix));
    node_worker_threads_1.parentPort?.postMessage('END');
}
