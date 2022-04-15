<script lang="ts">
import { nanoid } from 'nanoid'

export default {
    data() {
        return {
            clients: [{
                id: nanoid(),
                url: '',
                message: '',
                messages: [],
                ws: null
            }]
        }
    },
    watch: {
        clients: {
            deep: true,
            handler() {
                localStorage.setItem('Websocket-Client-Clients', JSON.stringify(this.clients.map(item => ({
                    ...item,
                    ws: null
                }))))
            }
        }
    },
    methods: {
        addClient() {
            this.clients.push({
                id: nanoid(),
                url: '',
                message: '',
                messages: [],
                ws: null
            })
        },
        removeClient(client) {
            if (client.ws) {
                ws.close()
            }
            this.clients = this.clients.filter(clientItem => clientItem.id !== client.id)
        },
        connect(client) {
            if (client.url === '') {
                return
            }
            client.ws = new WebSocket(client.url)
            client.ws.addEventListener('message', e => {
                client.messages.push({
                    timestamp: new Date().getTime(),
                    message: e.data,
                    type: 'RECEIVE'
                })
            })
        },
        sendMessage(client) {
            if (client.message === '') {
                return
            }
            client.ws.send(client.message)
            client.messages.push({
                timestamp: new Date().getTime(),
                message: client.message,
                type: 'SEND'
            })
        },
        clearMessages(client) {
            client.messages = []
        },
        disconnect(client) {
            client.ws.close()
            client.ws = null
        }
    },
    created() {
        const savedClients = localStorage.getItem('Websocket-Client-Clients')
        if (savedClients) {
            this.clients = JSON.parse(savedClients)
        }
    }
}
</script>

<template>
    <button @click="addClient">Add Client</button>
    <div style="display: flex">
        <div v-for="client in clients" class="client">
            <button @click="removeClient(client)">Remove</button>
            <div>
                <label>
                    Url<br>
                    <input type="text" v-model="client.url">
                </label>
                <button @click="connect(client)" v-if="client.ws === null">Connect</button>
                <button @click="disconnect(client)" v-else>Disconnect</button>
            </div>

            <div>
                <label>
                    Message<br>
                    <textarea v-model="client.message"></textarea>
                </label>
                <br>
                <button @click="sendMessage(client)">Send</button>
            </div>

            <div style="border: 1px solid lightgrey; padding: 0.5rem">
                <button @click="clearMessages(client)">Clear</button>
                <div v-for="message in client.messages">
                    <div>{{ message.timestamp }}</div>
                    <div>{{ message.type }}</div>
                    <div>{{ message.message }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.client {
    background-color: #e1e2ff;
    padding: 0.5rem;
}
</style>
