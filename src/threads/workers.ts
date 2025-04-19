import { parentPort, workerData } from 'node:worker_threads'
import fs from 'node:fs'
import readline from 'node:readline'

const startDate = Date.now()

const { id, filePath, start: startByte, end: endByte } = workerData

console.log(`Iniciando THREAD ${id}`)

const stream = fs.createReadStream(filePath, {
  start: startByte,
  end: endByte
})

const rl = readline.createInterface({
  input: stream
})

rl.on('line', line => {
  try {
    const obj = JSON.parse(line)
    // processa aqui, por exemplo:
    console.log(`[THREAD ${id}] Nome do item:`, obj.name)
  } catch (err) {
    console.error(`[THREAD ${id}] Erro ao parsear linha:`, line)
  }
})

rl.on('close', () => {
  const endDate = Date.now()
  console.log(`THREAD ${id} terminou o processamento.`)

  if (parentPort) {
    parentPort.postMessage({
      id: id,
      time: endDate - startDate
    })
  }
})
