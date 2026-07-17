import { WebSocketServer } from 'ws'
import { randomBytes, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'

const port = Number(process.env.PORT || process.env.MULTIPLAYER_PORT || 8787)
const rooms = new Map()

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

const httpServer = createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  if (requestUrl.pathname === '/health') {
    sendJson(response, 200, { status: 'ok', rooms: rooms.size })
    return
  }

  if (requestUrl.pathname === '/') {
    sendJson(response, 200, { service: 'teach-sim-server', status: 'ok', rooms: rooms.size })
    return
  }

  sendJson(response, 404, { error: 'Not found' })
})
const server = new WebSocketServer({ server: httpServer })

function code() { return `ATLAS-${randomBytes(2).toString('hex').toUpperCase()}` }
function send(socket, event) { if (socket.readyState === 1) socket.send(JSON.stringify(event)) }
function broadcast(room, event, except) { room.players.forEach(player => { if (player.socket !== except) send(player.socket, event) }) }
function leave(player) {
  if (!player.room) return
  const roomCode = player.room
  player.room = ''
  const room = rooms.get(roomCode)
  if (!room) return
  room.players = room.players.filter(item => item !== player)
  room.locks.forEach((owner, candidateId) => {
    if (owner === player.id) room.locks.delete(candidateId)
  })
  broadcast(room, { type: 'player-left', playerId: player.id })
  if (!room.players.length) rooms.delete(roomCode)
}

server.on('connection', socket => {
  const player = { id: randomUUID(), socket, room: '' }
  socket.isAlive = true
  socket.on('pong', () => { socket.isAlive = true })
  socket.on('message', raw => {
    let message
    try { message = JSON.parse(raw.toString()) } catch { return send(socket, { type: 'error', message: 'Некорректное сообщение' }) }
    if (message.type === 'create-room') {
      const cleanName = String(message.name || '').trim()
      if (!cleanName) return send(socket, { type: 'error', message: 'Укажите имя игрока' })
      player.name = cleanName
      const roomCode = code(); const room = { mode: 'co-op', players: [player], locks: new Map() }
      rooms.set(roomCode, room); player.room = roomCode
      return send(socket, { type: 'room-created', room: roomCode, playerId: player.id })
    }
    if (message.type === 'join-room') {
      const room = rooms.get(String(message.room || '').toUpperCase())
      if (!room) return send(socket, { type: 'error', message: 'Комната не найдена или уже закрыта' })
      if (room.players.length >= 2) return send(socket, { type: 'error', message: 'В комнате уже два игрока' })
      const cleanName = String(message.name || '').trim()
      if (!cleanName) return send(socket, { type: 'error', message: 'Укажите имя игрока' })
      if (room.players.some(item => item.name?.toLowerCase() === cleanName.toLowerCase())) return send(socket, { type: 'error', message: 'Это имя уже занято в данной сессии' })
      player.name = cleanName
      player.room = String(message.room).toUpperCase(); room.players.push(player)
      send(socket, { type: 'room-joined', room: player.room, playerId: player.id })
      room.locks.forEach((owner, candidateId) => send(socket, { type: 'candidate-locked', candidateId, playerId: owner }))
      broadcast(room, { type: 'player-joined', player: { id: player.id, name: cleanName } }, socket)
      return
    }
    const room = rooms.get(player.room)
    if (!room) return send(socket, { type: 'error', message: 'Сначала создайте или откройте комнату' })
    if (message.type === 'ready') { player.ready = Boolean(message.ready); broadcast(room, { type: 'player-ready', playerId: player.id, ready: player.ready }) }
    if (message.type === 'select-mode') { room.mode = message.mode === 'duel' ? 'duel' : 'co-op'; broadcast(room, { type: 'mode-selected', mode: room.mode }) }
    if (message.type === 'lock-candidate') {
      if (room.locks.has(message.candidateId) && room.locks.get(message.candidateId) !== player.id) return send(socket, { type: 'candidate-lock-rejected', candidateId: message.candidateId, message: 'Этот кандидат уже выбран вторым игроком' })
      room.locks.set(message.candidateId, player.id)
      broadcast(room, { type: 'candidate-locked', candidateId: message.candidateId, playerId: player.id })
    }
    if (message.type === 'game-event') broadcast(room, { type: 'game-event', event: message.event, payload: { ...(message.payload || {}), playerId: player.id } })
  })
  socket.on('error', error => {
    console.error('WebSocket connection error', error.message)
    leave(player)
  })
  socket.on('close', () => leave(player))
})

const heartbeat = setInterval(() => {
  server.clients.forEach(socket => {
    if (!socket.isAlive) return socket.terminate()
    socket.isAlive = false
    socket.ping()
  })
}, 30_000)

server.on('close', () => clearInterval(heartbeat))

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Teach Sim multiplayer server listening on http://0.0.0.0:${port}`)
})
