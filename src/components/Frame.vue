<template>
    <div class="client-component">
        <div class="d-f flex-jc-sb mb-0_5rem ml-1rem mr-0_5rem mt-0_5rem">
            <div>
                <button @click="showInterceptorsModal = true">
                    Configure Interceptors
                </button>
                <select v-model="interceptorsStatus" style="margin-left: 0.6rem">
                    <option>Enabled</option>
                    <option>Disabled</option>
                </select>
            </div>
            <button @click="addClient">Add Client</button>
        </div>
        <div class="clients">
            <div class="client" v-for="client in clients">
                <div class="d-f flex-ai-c p-0_5rem bc-primary">
                    <input
                        type="text"
                        v-model="client.url"
                        class="w-100p"
                        :disabled="client.ws ? true : false"
                    />
                    <div class="ml-0_5rem">
                        <button
                            @click="connect(client)"
                            v-if="client.ws === null"
                        >
                            Connect
                        </button>
                        <button @click="disconnect(client)" v-else>
                            Disconnect
                        </button>
                    </div>
                    <div class="ml-0_5rem">
                        <button class="icon" @click="removeClient(client)">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 1024 1024"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-0_5rem">
                    <textarea
                        class="w-100p"
                        rows="5"
                        placeholder="Payload"
                        v-model="client.message"
                    ></textarea>
                    <div class="align-right">
                        <button
                            @click="sendMessage(client)"
                            :disabled="client.ws === null"
                        >
                            Send
                        </button>
                    </div>
                </div>

                <div class="p-0_5rem bc-primary">
                    <div class="d-f flex-jc-sb flex-ai-c">
                        <div>Messages</div>
                        <button class="icon" @click="clearMessages(client)">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 1024 1024"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="oy-a">
                    <table
                        :ref="
                            (element) =>
                                handleMessageContainerRef(element, client.id)
                        "
                    >
                        <tbody>
                            <tr
                                v-for="message in client.messages"
                                :class="{
                                    'green-row': message.type === 'SEND',
                                    'red-row': message.type === 'RECEIVE'
                                }"
                            >
                                <td style="width: 1px; white-space: nowrap">
                                    <div
                                        v-if="message.type === 'SEND'"
                                        style="color: green"
                                    >
                                        <svg
                                            class="d-b"
                                            stroke="currentColor"
                                            fill="currentColor"
                                            stroke-width="0"
                                            viewBox="0 0 448 512"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Sent payload</title>
                                            <path
                                                d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div
                                        v-if="message.type === 'RECEIVE'"
                                        style="color: #cb3737"
                                    >
                                        <svg
                                            class="d-b"
                                            stroke="currentColor"
                                            fill="currentColor"
                                            stroke-width="0"
                                            viewBox="0 0 448 512"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Received payload</title>
                                            <path
                                                d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                                            ></path>
                                        </svg>
                                    </div>
                                </td>
                                <td style="width: 100%; white-space: pre">
                                    {{ parseAndFormatMessage(message.message) }}
                                </td>
                                <td style="width: 1px; white-space: nowrap">
                                    {{ formatTimestamp(message.timestamp) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <Modal
        title="Configure Interceptors"
        v-model="showInterceptorsModal"
        width="60vw"
        height="70vh"
        v-if="showInterceptorsModal"
    >
        <div class="d-f h-100p">
            <div class="w-100p">
                <label style="overflow: auto">
                    <div style="font-weight: 500; margin-bottom: 0.25rem">
                        Send Interceptor Code
                    </div>
                    <CodeMirrorEditor
                        v-model="sendInterceptorCode"
                        lang="javascript"
                        class="code-editor"
                    ></CodeMirrorEditor>
                </label>
            </div>
            <div class="w-100p ml-1rem">
                <label style="overflow: auto">
                    <div style="font-weight: 500; margin-bottom: 0.25rem">
                        Receive Interceptor Code
                    </div>
                    <CodeMirrorEditor
                        v-model="receiveInterceptorCode"
                        lang="javascript"
                        class="code-editor"
                    ></CodeMirrorEditor>
                </label>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { Ref, ref, watch, nextTick, onBeforeMount, reactive } from 'vue'
import { Client } from '../types'
import { formatTimestamp, generateId } from '../helpers'
import Modal from './Modal.vue'
import CodeMirrorEditor from './CodeMirrorEditor.vue'

// Data Variables

const messageContainerRefs: any = reactive({})

function handleMessageContainerRef(ref: any, clientId: string) {
    messageContainerRefs[clientId] = ref
}

const initialClients: Client[] = [
    {
        id: generateId(),
        url: '',
        message: '',
        messages: [],
        ws: null
    }
]

const clients: Ref<Client[]> = ref(initialClients)

const showInterceptorsModal = ref(false)

const sendInterceptorCode = ref('')
const receiveInterceptorCode = ref('')

const interceptorsStatus = ref('Enabled')

// Methods

function addClient() {
    clients.value.push({
        id: generateId(),
        url: '',
        message: '',
        messages: [],
        ws: null
    })
}

function removeClient(client: Client) {
    if (!confirm('Are you sure you want to remove this client?')) {
        return
    }
    client.ws?.close()
    clients.value = clients.value.filter(
        (clientItem) => clientItem.id !== client.id
    )
}

function connect(client: Client) {
    if (client.url === '') {
        return
    }
    client.ws = new WebSocket(client.url)
    client.ws.addEventListener('message', async (e) => {
        let receivedMessage = e.data

        if(interceptorsStatus.value !== 'Disabled') {
            eval(receiveInterceptorCode.value)

            if ('getReceiveMessage' in window) {
                receivedMessage = await (window as any).getReceiveMessage(
                    receivedMessage
                )
                delete (window as any).getReceiveMessage
            }
        }

        client.messages.push({
            timestamp: new Date().getTime(),
            message: receivedMessage,
            type: 'RECEIVE'
        })
        scrollToBottomClientMessages(client.id)
    })
}

async function sendMessage(client: Client) {
    if (client.message === '') {
        return
    }

    let messageToSend = client.message

    if(interceptorsStatus.value !== 'Disabled') {
        eval(sendInterceptorCode.value)

        if ('getSendMessage' in window) {
            messageToSend = await (window as any).getSendMessage(client.message)
            delete (window as any).getSendMessage
        }
    }

    client.ws?.send(messageToSend)
    client.messages.push({
        timestamp: new Date().getTime(),
        message: client.message,
        type: 'SEND'
    })
    scrollToBottomClientMessages(client.id)
}

function clearMessages(client: Client) {
    client.messages = []
}

function disconnect(client: Client) {
    client.ws?.close()
    client.ws = null
}

function parseAndFormatMessage(message: string) {
    let parsedMessage = null
    try {
        parsedMessage = JSON.stringify(JSON.parse(message), null, 4)
    } catch {}
    if (parsedMessage) {
        return parsedMessage
    }
    return message
}

function scrollToBottomClientMessages(clientId: string, smooth = true) {
    nextTick(() => {
        messageContainerRefs[clientId].scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end'
        })
    })
}

// Watch

const localStoragePrefix = 'WebSocket-Client-'

const localStorageKeys = {
    clients: localStoragePrefix + 'clients',
    sendInterceptorCode: localStoragePrefix + 'sendInterceptorCode',
    receiveInterceptorCode: localStoragePrefix + 'receiveInterceptorCode',
    interceptorsStatus: localStoragePrefix + 'interceptorsStatus'
}

watch(
    clients,
    () => {
        localStorage.setItem(
            localStorageKeys.clients,
            JSON.stringify(
                clients.value.map((item) => ({
                    ...item,
                    ws: null
                }))
            )
        )
    },
    { deep: true }
)

watch(sendInterceptorCode, () => {
    localStorage.setItem(
        localStorageKeys.sendInterceptorCode,
        sendInterceptorCode.value
    )
})

watch(receiveInterceptorCode, () => {
    localStorage.setItem(
        localStorageKeys.receiveInterceptorCode,
        receiveInterceptorCode.value
    )
})

watch(interceptorsStatus, () => {
    localStorage.setItem(
        localStorageKeys.interceptorsStatus,
        interceptorsStatus.value
    )
})

// Lifecycle Events

onBeforeMount(() => {
    const savedClients = localStorage.getItem(localStorageKeys.clients)
    if (savedClients) {
        clients.value = JSON.parse(savedClients)
        clients.value.forEach((client) => {
            scrollToBottomClientMessages(client.id, false)
        })
    }

    const savedSendInterceptorCode = localStorage.getItem(
        localStorageKeys.sendInterceptorCode
    )
    if (savedSendInterceptorCode) {
        sendInterceptorCode.value = savedSendInterceptorCode
    }

    const savedReceiveInterceptorCode = localStorage.getItem(
        localStorageKeys.receiveInterceptorCode
    )
    if (savedReceiveInterceptorCode) {
        receiveInterceptorCode.value = savedReceiveInterceptorCode
    }

    const savedInterceptorsStatus = localStorage.getItem(
        localStorageKeys.interceptorsStatus
    )
    if (savedInterceptorsStatus) {
        interceptorsStatus.value = savedInterceptorsStatus
    }
})
</script>

<style scoped>
.client-component {
    display: grid;
    height: 100%;
    overflow-y: auto;
    grid-template-rows: auto 1fr;
}

.clients {
    display: flex;
    gap: 0.5rem;
    height: 100%;
    overflow-y: auto;
}

.client {
    flex: 1;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    border: 1px solid var(--default-border-color);
    border-radius: 5px;
}

table tr > td:first-child {
    border-left: 0;
}

table tr > td:last-child {
    border-right: 0;
}

table tr.green-row > td {
    background-color: #ddffb6;
}

table svg {
    font-size: 0.9rem;
}

/* table tr.red-row > td {
    background-color: #ffb6b6;
} */

.code-editor {
    height: calc(100% - 1.2rem);
    overflow-y: auto;
    border: 1px solid var(--default-border-color);
}
</style>
