export type MultiplayerEvent =
  | { type: 'room-created'; room: string; playerId: string }
  | { type: 'room-joined'; room: string; playerId: string }
  | { type: 'player-joined'; player: { id: string; name: string } }
  | { type: 'player-left'; playerId: string }
  | { type: 'player-ready'; playerId: string; ready: boolean }
  | { type: 'mode-selected'; mode: 'duel' | 'co-op' }
  | { type: 'candidate-locked'; candidateId: string; playerId: string }
  | { type: 'candidate-lock-rejected'; candidateId: string; message: string }
  | { type: 'remote-progress'; playerId: string; answered: number; total: number; score: number; finished?: boolean }
  | { type: 'game-event'; event: string; payload: unknown }
  | { type: 'error'; message: string }

type Listener = (event: MultiplayerEvent) => void

export class MultiplayerClient {
  private socket?: WebSocket
  private listeners = new Set<Listener>()
  private pending: object[] = []
  private url = (import.meta.env.VITE_MULTIPLAYER_URL as string | undefined) || 'ws://localhost:8787'
  room = ''
  playerId = ''
  mode: 'duel' | 'co-op' = 'co-op'
  connected = false
  lockedCandidates = new Set<string>()

  on(listener: Listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  private emit(event: MultiplayerEvent) {
    if (event.type === 'room-created' || event.type === 'room-joined') { this.room = event.room; this.playerId = event.playerId }
    if (event.type === 'mode-selected') this.mode = event.mode
    if (event.type === 'candidate-locked') this.lockedCandidates.add(event.candidateId)
    this.listeners.forEach(listener => listener(event))
  }

  connect() {
    if (!this.url) return false
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) return true
    this.socket = undefined
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => { this.connected = true; const pending = this.pending.splice(0); pending.forEach(message => this.socket?.send(JSON.stringify(message))) }
    this.socket.onclose = () => { this.connected = false; this.socket = undefined; this.pending = [] }
    this.socket.onmessage = message => { try { this.emit(JSON.parse(message.data) as MultiplayerEvent) } catch { /* ignore malformed frames */ } }
    this.socket.onerror = () => this.emit({ type: 'error', message: 'Не удалось подключиться к серверу комнат' })
    return true
  }
  private send(message: object) { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message)); else if (this.socket?.readyState === WebSocket.CONNECTING) this.pending.push(message); else this.emit({ type: 'error', message: 'Онлайн-сервер пока недоступен' }) }
  create(name: string) { this.send({ type: 'create-room', name }) }
  join(room: string, name: string) { this.send({ type: 'join-room', room: room.toUpperCase(), name }) }
  ready(ready: boolean) { this.send({ type: 'ready', ready }) }
  selectMode(mode: 'duel' | 'co-op') { this.mode = mode; this.send({ type: 'select-mode', mode }) }
  gameEvent(event: string, payload: unknown) { this.send({ type: 'game-event', event, payload }) }
  lockCandidate(candidateId: string) { this.send({ type: 'lock-candidate', candidateId }) }
  close() { this.socket?.close(); this.socket = undefined; this.connected = false; this.pending = []; this.room = ''; this.playerId = ''; this.mode = 'co-op'; this.lockedCandidates.clear() }
}

export const multiplayer = new MultiplayerClient()
