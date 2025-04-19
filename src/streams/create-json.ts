const fs = require('fs')
const path = require('path')

const stream = fs.createWriteStream(path.join(__dirname, 'bigfile.json'))
stream.write('[\n')

let size = 0
const targetSize = 1024 * 1024 * 1024 // 1 GB
let i = 0

function writeChunk() {
  let ok = true
  while (size < targetSize && ok) {
    const obj = {
      id: i,
      name: `Item ${i}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      timestamp: new Date().toISOString(),
      data: Array(20).fill(Math.random().toString(36).substring(2, 15)).join('')
    }
    const json = JSON.stringify(obj) + ',\n'
    size += Buffer.byteLength(json)
    i++

    if (size >= targetSize) {
      // remove última vírgula e fecha o array
      stream.write(json.slice(0, -2) + '\n')
      stream.write(']')
      console.log(
        `✅ Arquivo gerado com aproximadamente ${(size / 1024 / 1024).toFixed(
          2
        )} MB e ${i} objetos.`
      )
      return
    }

    ok = stream.write(json)
  }

  if (size < targetSize) {
    stream.once('drain', writeChunk)
  }
}

writeChunk()
