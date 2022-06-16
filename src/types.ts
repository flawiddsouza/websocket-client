export interface ClientMessage {
    timestamp: number
    message: string
    type: 'SEND' | 'RECEIVE'
}

export interface Client {
    projectId: string,
    id: string
    url: string
    message: string
    messages: ClientMessage[]
    ws: WebSocket | null
    visibility?: 'shown' | 'hidden'
}

export interface Project {
    id: string,
    name: string,
    environment?: any
}
