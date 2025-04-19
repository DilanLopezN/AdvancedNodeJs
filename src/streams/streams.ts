import fs from 'node:fs'
import { pipeline, Transform, Writable, Readable } from 'node:stream'
import { parser } from 'stream-json'
import { streamArray } from 'stream-json/streamers/StreamArray'

const fileStream = fs.createReadStream('./bigfile.json')

const transformedStream = new Transform({
  objectMode: true,
  write(ck, en, cbc) {
    this.push({
      id: ck.value.name
    })

    cbc()
  }
})

const witrablestream = new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    console.log(chunk) // Log each item from the stream
    callback()
  }
})

pipeline(
  fileStream,
  parser(),
  streamArray(),
  transformedStream,
  witrablestream,
  err => {
    if (err) {
      console.error('Pipeline failed:', err)
    } else {
      console.log('Pipeline succeeded')
    }
  }
)
