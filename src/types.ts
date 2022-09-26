export interface ClientMessage {
    timestamp: number
    message: string
    type: 'SEND' | 'RECEIVE'
}

export interface ClientPayload {
    id: string,
    name: string,
    payload: string
}

export interface Client {
    projectId: string,
    id: string
    url: string
    payloads: ClientPayload[],
    currentPayloadId: string,
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
