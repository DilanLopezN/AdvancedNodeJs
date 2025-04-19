import { Worker } from 'node:worker_threads'
import os from 'node:os'

const numCPUs = os.cpus().length // nucleos disponiveis

console.log(numCPUs)

for (let i = 0; i < numCPUs; i++) {
  const worker = new Worker('./worker.js', {
    workerData: { id: i }
  })

  worker.on('message', msg => {
    console.log(`Worker ${msg.id} terminou em ${msg.time}ms`)
  })

  worker.on('error', err => {
    console.error(`Erro no worker ${i}:`, err)
  })

  worker.on('exit', code => {
    if (code !== 0) console.log(`Worker ${i} saiu com código ${code}`)
  })
}
