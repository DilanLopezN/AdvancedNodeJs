import { createHash } from 'node:crypto'
import {
  isMainThread,
  Worker,
  workerData,
  parentPort
} from 'node:worker_threads'
import os from 'node:os'

if (isMainThread) {
  const threads = Number(process.argv[2])
  const prefix = process.argv[3]
  const input = process.argv.slice(4).join(' ')
  const numCPUs = os.cpus().length

  if (threads > numCPUs) throw new Error('excedendo nº máximo de threads')

  const workers: Worker[] = []

  for (let index = 0; index < threads; index++) {
    const worker = new Worker(__filename, {
      workerData: { prefix, input }
    })

    worker.on('message', message => {
      if (message == 'END') {
        workers
          .filter(diferrenteWorker => diferrenteWorker !== worker)
          .forEach(diferrenteWorker => diferrenteWorker.terminate())
      }
    })

    workers.push(worker)
  }
} else {
  let nonce: string
  let hash: string

  do {
    nonce = `${Math.random().toFixed(10).substring(2)}${Math.random()
      .toFixed(10)
      .substring(2)}`
    hash = createHash('sha256')
      .update(`${workerData.input}${nonce}`)
      .digest('hex')
    console.log(`Input: ${workerData.input} / Nonce ${nonce} / Hash ${hash}`)
  } while (!hash.startsWith(workerData.prefix))

  parentPort?.postMessage('END')
}
