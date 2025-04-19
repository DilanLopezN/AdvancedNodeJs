import { Worker } from 'node:worker_threads'
import os from 'node:os'
import fs from 'node:fs'
const numCPUs = os.cpus().length
const threadsForUse = 12
const filePath = './bigfile.json'

if (threadsForUse > numCPUs) {
  throw new Error('Número de threads excedido')
}

const fileStats = fs.statSync(filePath)
const totalFileSize = fileStats.size
const bytesPerThread = Math.floor(totalFileSize / threadsForUse)

console.log(
  `Tamanho total do arquivo: ${(totalFileSize / (1024 * 1024)).toFixed(2)} MB`
)
console.log(
  `Cada thread irá processar aproximadamente: ${(
    bytesPerThread /
    (1024 * 1024)
  ).toFixed(2)} MB`
)

for (let i = 0; i < threadsForUse; i++) {
  const start = i * bytesPerThread
  const end =
    i === threadsForUse - 1 ? totalFileSize - 1 : (i + 1) * bytesPerThread - 1

  const worker = new Worker('./src/threads/workers.js', {
    workerData: {
      id: i,
      filePath,
      start,
      end
    }
  })

  worker.on('message', msg => {
    if (msg.error) {
      console.error(`Worker ${msg.id} erro: ${msg.error}`)
    } else {
      console.log(`Worker ${msg.id} terminou em ${msg.time}ms`)
      console.log(`Worker ${msg.id} processou: ${msg.processedBytes} bytes`)
    }
  })

  worker.on('error', err => {
    console.error(`Erro no worker ${i}:`, err)
  })

  worker.on('exit', code => {
    if (code !== 0) console.log(`Worker ${i} saiu com código ${code}`)
  })
}
