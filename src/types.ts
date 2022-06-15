export interface ClientMessage {
    timestamp: number
    message: string
    type: 'SEND' | 'RECEIVE'
}

export interface Client {
    id: string
    url: string
    message: string
    messages: ClientMessage[]
    ws: WebSocket | null
    visibility?: 'shown' | 'hidden'
}
