// Check the requested port before Next can silently choose another one.
const net = require('node:net')
const { spawn } = require('node:child_process')
const mode = process.argv[2] || 'dev'
const port = Number(process.env.PORT || 3000)
if (!['dev', 'start'].includes(mode) || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Use dev or start with a PORT between 1 and 65535.')
  process.exit(1)
}
const probe = net.createServer()
probe.once('error', (error) => {
  console.error(`Port ${port} is unavailable: ${error.code}. Choose another PORT; do not stop its owner.`)
  process.exitCode = 1
})
probe.listen(port, '127.0.0.1', () => probe.close(() => {
  const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), mode, '--hostname', '127.0.0.1', '--port', String(port)], { stdio: 'inherit' })
  const forward = (signal) => { if (!child.killed) child.kill(signal) }
  process.on('SIGINT', () => forward('SIGINT'))
  process.on('SIGTERM', () => forward('SIGTERM'))
  child.once('error', (error) => { console.error(error); process.exitCode = 1 })
  child.once('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
}))
