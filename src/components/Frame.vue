<template>
    <div class="client-container">
        <div class="client-sidebar" v-if="showSidebar">
            <button style="margin-bottom: 0.7rem; width: 100%;" @click="addProject">Add Project</button>
            <div
                v-for="project in projects"
                class="client-sidebar-item"
                :class="{ 'client-sidebar-item-selected': project.id === selectedProjectId }"
                @click="setSelectedProject(project.id)"
            >
                <div>{{ project.name }}</div>
                <div style="height: 1.4rem" class="client-sidebar-item-menu" :class="{ 'client-sidebar-item-menu-disable-hide': project.id === clickedContextMenuProject.id &&  showProjectContextMenuPopup === true }" @click.stop="showProjectContextMenu($event, project)">
                    <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                        <g>
                            <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        <div v-else></div>
        <div class="client-component">
            <div class="d-f flex-jc-sb mb-0_5rem ml-1rem mr-0_5rem mt-0_5rem">
                <div>
                    <button @click="showSidebar = !showSidebar">☰</button>
                    <button
                        @click="showInterceptorsModal = true"
                        style="margin-left: 0.6rem"
                    >
                    Configure Interceptors
                    </button>
                    <select
                        v-model="interceptorsStatus"
                        style="margin-left: 0.6rem"
                    >
                        <option>Enabled</option>
                        <option>Disabled</option>
                    </select>
                    <div style="display: inline-flex">
                        <div v-for="(client, index) in clients">
                            <button
                                style="margin-left: 0.6rem"
                                :class="{
                                    disabled: client.visibility === 'hidden',
                                    'c-p-i': client.visibility === 'hidden'
                                }"
                                @click="toggleClientVisibility(client)"
                            >
                                Client #{{ index + 1 }}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <button @click="startBackupRestore">Backup & Restore</button>
                    <button @click="addClient" class="ml-1rem">Add Client</button>
                </div>
            </div>
            <div class="clients">
                <template v-for="client in clients">
                    <div
                        class="client"
                        v-if="!client.visibility || client.visibility === 'shown'"
                    >
                        <div class="d-f flex-ai-c p-0_5rem bc-primary">
                            <select
                                v-model="client.type"
                                class="h-100p"
                                :disabled="client.ws ? true : false"
                            >
                                <option :value="undefined">WS</option>
                                <option value="Socket.IO">IO</option>
                            </select>
                            <input
                                type="text"
                                v-model="client.url"
                                :placeholder="`${client.type === undefined ? 'WebSocket URL' : 'Socket.IO URL'}`"
                                class="ml-0_5rem w-100p"
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

                        <div class="p-0_5rem o-a">
                            <tabs
                                :tabs="client.payloads"
                                :currentTabId="client.currentPayloadId"
                                @change-tab="changePayloadTab(client, $event)"
                                @close-tab="closePayloadTab(client, $event)"
                            >
                                <button @click="addNewPayload(client)" style="white-space: nowrap" title="Add New Payload">+</button>
                            </tabs>
                            <div class="d-f mt-0_5rem">
                                <input
                                    type="text"
                                    placeholder="Payload Name"
                                    class="w-100p"
                                    :value="getCurrentPayloadValue(client, 'name')"
                                    @input="updateCurrentPayload(client, 'name', ($event as any).target.value)"
                                />
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    class="w-100p ml-0_5rem"
                                    :value="getCurrentPayloadValue(client, 'event')"
                                    @input="updateCurrentPayload(client, 'event', ($event as any).target.value)"
                                    v-if="client.type === 'Socket.IO'"
                                />
                            </div>
                            <textarea
                                class="w-100p mt-0_5rem"
                                rows="5"
                                placeholder="Payload"
                                v-model="client.message"
                                @input="updateCurrentPayload(client, 'payload', ($event as any).target.value)"
                            ></textarea>
                            <div class="d-f flex-jc-sb">
                                <button
                                    @click="beautifyJSON(client)"
                                >
                                    Beautify JSON
                                </button>
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
                                        handleMessageContainerRef(
                                            element,
                                            client.id
                                        )
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
                                        <td style="width: 100%; white-space: pre-wrap; word-break: break-all;">
                                            {{
                                                parseAndFormatMessage(
                                                    message.message
                                                )
                                            }}
                                        </td>
                                        <td style="width: 1px; white-space: nowrap">
                                            {{ formatTimestamp(message.timestamp) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
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
    <EnvironmentModal v-model:showModal="environmentModalShow" :project="clickedContextMenuProject" />
    <div class="context-menu" :style="{ top: showProjectContextMenuPopupCoords.y, left: showProjectContextMenuPopupCoords.x }" v-if="showProjectContextMenuPopup">
        <div @click="duplicateProject">Duplicate</div>
        <div @click="exportProject">Export</div>
        <div @click="importProject">Import</div>
        <div @click="environmentProject">Environment</div>
        <div @click="renameProject">Rename</div>
        <div @click="deleteProject">Delete</div>
    </div>
    <Modal
        title="Backup & Restore"
        v-model="showBackupRestoreModal"
        v-if="showBackupRestoreModal"
    >
        <div>
            <div>Backup</div>
            <button @click="downloadBackup" class="mt-1rem">Download Backup</button>
        </div>

        <div style="margin-top: 2rem"></div>

        <form class="mt-1rem" @submit.prevent="restoreBackup">
            <div>Restore</div>
            <div class="mt-1rem">
                <input type="file" @change="handleRestoreFileChange" required style="font-size: 0.9rem" />
            </div>
            <button class="mt-1rem">Restore Backup</button>
        </form>
    </Modal>
</template>

<script setup lang="ts">
import { Ref, ref, watch, nextTick, onBeforeMount, reactive, onMounted, onUnmounted } from 'vue'
import { Client, ClientPayload, ClientMessage, Project } from '../types'
import { formatTimestamp, generateId, getObjectPaths } from '../helpers'
import getObjectPathValue from 'lodash.get'
import Modal from './Modal.vue'
import CodeMirrorEditor from './CodeMirrorEditor.vue'
import EnvironmentModal from './EnvironmentModal.vue'
import Tabs from './Tabs.vue'
import { Socket, io } from 'socket.io-client'

// Data Variables

const messageContainerRefs: any = reactive({})

function handleMessageContainerRef(ref: any, clientId: string) {
    messageContainerRefs[clientId] = ref
}

const projects: Ref<Project[]> = ref([])
const selectedProjectId = ref()
const clients: Ref<Client[]> = ref([])
const showInterceptorsModal = ref(false)
const sendInterceptorCode = ref('')
const receiveInterceptorCode = ref('')
const interceptorsStatus = ref('Enabled')
const showSidebar = ref(true)
const clickedContextMenuProject: Ref<Project> = ref({ id: '', name: '' })
const showProjectContextMenuPopup = ref(false)
const showProjectContextMenuPopupCoords = ref({
    x: '',
    y: ''
})
const environmentModalShow = ref(false)
const showBackupRestoreModal = ref(false)
const fileToRestore = ref<File | null>(null)

// Methods

function addProject() {
    const projectName = prompt('Enter new project name')

    if(!projectName || projectName.trim() === '') {
        return
    }

    const newProject = {
        id: generateId(),
        name: projectName
    }

    projects.value.push(newProject)
    setSelectedProject(newProject.id)
}

function setSelectedProject(projectId: string) {
    selectedProjectId.value = projectId
    loadSavedClients(selectedProjectId.value)
}

function duplicateProject() {
    const newProjectName = prompt('Enter new project name', clickedContextMenuProject.value.name)

    if(!newProjectName || newProjectName.trim() === '') {
        hideProjectContextMenu()
        return
    }

    const newProject = {
        id: generateId(),
        name: newProjectName,
        environment: clickedContextMenuProject.value.environment
    }

    projects.value.push(newProject)
    localStorage.setItem(
        localStorageKeys.clients + `-${newProject.id}`,
        localStorage.getItem(localStorageKeys.clients + `-${clickedContextMenuProject.value.id}`) ?? ''
    )
    setSelectedProject(newProject.id)

    hideProjectContextMenu()
}

function exportProject() {
    const project = {
        id: selectedProjectId.value,
        name: clickedContextMenuProject.value.name,
        environment: clickedContextMenuProject.value.environment,
        clients: clients.value
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 4))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${project.name}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

function importProject() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files![0]
        if(file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const importedProject = JSON.parse(event.target!.result as string)
                const project = {
                    id: generateId(),
                    name: importedProject.name,
                    environment: importedProject.environment,
                    clients: importedProject.clients
                }
                projects.value.push(project)
                localStorage.setItem(
                    localStorageKeys.clients + `-${project.id}`,
                    JSON.stringify(
                        importedProject.clients.map((item: Client) => ({
                            ...item,
                            ws: null
                        }))
                    )
                )
                setSelectedProject(project.id)
            }
            reader.readAsText(file)
        }
    })
    fileInput.click()
    hideProjectContextMenu()
}

function environmentProject() {
    environmentModalShow.value = true
    hideProjectContextMenu(false)
}

function renameProject() {
    const newProjectName = prompt('Enter new project name', clickedContextMenuProject.value.name)

    if(!newProjectName || newProjectName.trim() === '') {
        hideProjectContextMenu()
        return
    }

    clickedContextMenuProject.value.name = newProjectName

    hideProjectContextMenu()
}

function deleteProject() {
    if(projects.value.length === 1) {
        alert('Cannot delete project as there\'s only one project left')
        hideProjectContextMenu()
        return
    }

    if(!confirm('Are you sure you want to delete this project?')) {
        hideProjectContextMenu()
        return
    }

    projects.value = projects.value.filter(project => project.id !== clickedContextMenuProject.value.id)

    localStorage.removeItem(localStorageKeys.clients + `-${clickedContextMenuProject.value.id}`)

    if(clickedContextMenuProject.value.id === selectedProjectId.value) {
        setSelectedProject(projects.value[0].id)
    }

    hideProjectContextMenu()
}

function addClient() {
    const payloadId = generateId()

    clients.value.push({
        projectId: selectedProjectId.value,
        id: generateId(),
        url: '',
        payloads: [
            {
                id: payloadId,
                name: 'Payload 1',
                payload: ''
            }
        ],
        currentPayloadId: payloadId,
        message: '',
        messages: [],
        ws: null,
        visibility: 'shown'
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

function toggleClientVisibility(client: Client) {
    client.visibility =
        !client.visibility || client.visibility === 'shown' ? 'hidden' : 'shown'
}

function getEnvironment() {
    const selectedProject = projects.value.find(project => project.id === selectedProjectId.value)
    const environment = selectedProject?.environment ?? {}
    return environment
}

function connect(client: Client) {
    if (client.url === '') {
        return
    }

    let clientUrlWithEnvironmentVariablesSubtituted = client.url
    const environment = getEnvironment()
    const possibleEnvironmentObjectPaths: string[] = getObjectPaths(environment)

    possibleEnvironmentObjectPaths.forEach(objectPath => {
        const objectPathValue = getObjectPathValue(environment, objectPath)
        clientUrlWithEnvironmentVariablesSubtituted = clientUrlWithEnvironmentVariablesSubtituted.replace(`{{ _.${objectPath} }}`, objectPathValue)
        clientUrlWithEnvironmentVariablesSubtituted = clientUrlWithEnvironmentVariablesSubtituted.replace(`{{${objectPath}}}`, objectPathValue)
    })

    try {
        if (client.type === undefined) {
            client.ws = new WebSocket(clientUrlWithEnvironmentVariablesSubtituted)
        } else if (client.type === 'Socket.IO') {
            client.ws = io(clientUrlWithEnvironmentVariablesSubtituted)
        }
    } catch {
        alert(`Invalid WebSocket URL: ${clientUrlWithEnvironmentVariablesSubtituted}`)
        return
    }

    if (client.ws instanceof WebSocket) {
        client.ws.addEventListener('message', async (e) => {
            let receivedMessage = e.data

            clientMessageHandler(client, receivedMessage)
        })

        client.ws.addEventListener('close', async () => {
            disconnect(client)
        })
    }

    if (client.ws instanceof Socket) {
        client.ws.onAny(async (event, ...args) => {
            const receivedMessage = `[${event}] ${args[0]}`
            clientMessageHandler(client, receivedMessage)
        })

        client.ws.on('disconnect', async () => {
            disconnect(client)
        })
    }
}

async function clientMessageHandler(client: Client, receivedMessage: string) {
    if (interceptorsStatus.value !== 'Disabled') {
        (window as any).getEnvironmentVariable = (objectPath: string) => {
            const environment = getEnvironment()
            return getObjectPathValue(environment, objectPath)
        }

        eval(receiveInterceptorCode.value)

        if ('getReceiveMessage' in window) {
            receivedMessage = await (window as any).getReceiveMessage(
                receivedMessage
            )
            delete (window as any).getReceiveMessage
        }
    }

    const clientMessage: ClientMessage = {
        timestamp: new Date().getTime(),
        message: receivedMessage,
        type: 'RECEIVE'
    }

    addClientMessage(client, clientMessage)
}

function addClientMessage(client: Client, clientMessage: ClientMessage) {
    client.messages.push(clientMessage)

    // keep only last 100 messages to avoid crashing the application
    client.messages = client.messages.slice(-100)

    if (client.visibility !== 'hidden') {
        scrollToBottomClientMessages(client.id)
    }
}

function beautifyJSON(client: Client) {
    try {
        const parsedMessage = JSON.parse(client.message)
        client.message = JSON.stringify(parsedMessage, null, 4)
        client.payloads.find(payload => payload.id === client.currentPayloadId)!.payload = client.message
    } catch {
        alert('Invalid JSON')
    }
}

async function sendMessage(client: Client) {
    if (client.message === '') {
        return
    }

    if (client.ws instanceof Socket && (client.event === undefined || client.event === '')) {
        return
    }

    let messageToSend = client.message

    const environment = getEnvironment()
    const possibleEnvironmentObjectPaths: string[] = getObjectPaths(environment)

    possibleEnvironmentObjectPaths.forEach(objectPath => {
        const objectPathValue = getObjectPathValue(environment, objectPath)
        messageToSend = messageToSend.replace(`{{ _.${objectPath} }}`, objectPathValue)
        messageToSend = messageToSend.replace(`{{${objectPath}}}`, objectPathValue)
    })

    if (interceptorsStatus.value !== 'Disabled') {
        (window as any).getEnvironmentVariable = (objectPath: string) => {
            const environment = getEnvironment()
            return getObjectPathValue(environment, objectPath)
        }

        eval(sendInterceptorCode.value)

        if ('getSendMessage' in window) {
            messageToSend = await (window as any).getSendMessage(client.message)
            delete (window as any).getSendMessage
        }
    }

    if (client.ws instanceof WebSocket) {
        client.ws.send(messageToSend)
    }

    if (client.ws instanceof Socket && client.event !== undefined) {
        client.ws.emit(client.event, messageToSend)
    }

    let clientMessageToSave = messageToSend

    if (client.ws instanceof Socket) {
        clientMessageToSave = `[${client.event}] ${clientMessageToSave}`
    }

    const clientMessage: ClientMessage = {
        timestamp: new Date().getTime(),
        message: clientMessageToSave,
        type: 'SEND'
    }

    addClientMessage(client, clientMessage)
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

function scrollToBottomClientMessages(clientId: string) {
    nextTick(() => {
        messageContainerRefs[clientId].scrollIntoView({
            behavior: 'auto',
            block: 'end'
        })
    })
}

function migrateSavedClientToNewDataStructure(client: Client) {
    if('payloads' in client === false) {
        const payloadId = generateId()
        client.payloads = [
            {
                id: payloadId,
                name: 'Payload 1',
                payload: ''
            }
        ]
        client.currentPayloadId = payloadId
    }
}

function loadSavedClients(projectId: string) {
    const savedClients = localStorage.getItem(localStorageKeys.clients + `-${projectId}`)
    if (savedClients) {
        clients.value = JSON.parse(savedClients)
        clients.value.forEach((client) => {
            migrateSavedClientToNewDataStructure(client)
            if (client.visibility !== 'hidden') {
                scrollToBottomClientMessages(client.id)
            }
        })
    } else {
        const firstPayloadId = generateId()

        const initialClient: Client = {
            projectId: projectId,
            id: generateId(),
            url: '',
            payloads: [
                {
                    id: firstPayloadId,
                    name: 'Payload 1',
                    payload: ''
                }
            ],
            currentPayloadId: firstPayloadId,
            message: '',
            messages: [],
            ws: null,
            visibility: 'shown'
        }

        clients.value = [initialClient]
    }
}

function showProjectContextMenu(event: MouseEvent, project: Project) {
    if(clickedContextMenuProject.value.id === project.id && showProjectContextMenuPopup.value === true) {
        hideProjectContextMenu()
        return
    }
    const menuElement = event.target as Element
    var clientRect = menuElement.getBoundingClientRect()
    var clientX = clientRect.left
    var clientY = clientRect.top
    clickedContextMenuProject.value = project
    showProjectContextMenuPopupCoords.value.x = clientX + 'px'
    showProjectContextMenuPopupCoords.value.y = (clientY + clientRect.height + 5) + 'px'
    showProjectContextMenuPopup.value = true
}

function hideProjectContextMenu(clearClickedContextMenuProject=true) {
    if(showProjectContextMenuPopup.value === false) {
        return
    }
    showProjectContextMenuPopup.value = false
    if(clearClickedContextMenuProject) {
        clickedContextMenuProject.value = { id: '', name: '' }
    }
}

function hideContextMenusWhenClickedOutside(event: Event) {
    const target = document.querySelector('.context-menu')

    const withinBoundaries = event.composedPath().includes(target as EventTarget)

    if (!withinBoundaries) {
        hideProjectContextMenu()
    }
}

function addNewPayload(client: Client) {
    const payloadId = generateId()

    client.payloads.push({
        id: payloadId,
        name: `Payload ${client.payloads.length + 1}`,
        payload: ''
    })

    client.currentPayloadId = payloadId
    client.message = ''
}

function updateCurrentPayload(client: Client, field: 'name' | 'event' | 'payload', value: string) {
    const payloadToUpdate: ClientPayload | undefined = client.payloads.find(payload => payload.id === client.currentPayloadId)
    if(payloadToUpdate) {
        payloadToUpdate[field] = value
        if (field === 'event') {
            client.event = value
        }
    }
}

function changePayloadTab(client: Client, tab: ClientPayload) {
    client.currentPayloadId = tab.id
    client.message = tab.payload
    client.event = tab.event
}

function closePayloadTab(client: Client, event: { tabToClose: ClientPayload, tabToOpen: ClientPayload }) {
    if(client.payloads.length === 1) {
        alert('Cannot delete payload as there\'s only one payload left')
        return
    }

    if(!confirm(`Are you sure you want to remove "${event.tabToClose.name}?"`)) {
        return
    }

    client.payloads = client.payloads.filter(clientPayload => clientPayload.id !== event.tabToClose.id)

    if(event.tabToOpen) {
        client.currentPayloadId = event.tabToOpen.id
        client.message = event.tabToOpen.payload
    }
}

function getCurrentPayloadValue(client: Client, field: 'name' | 'event' | 'payload') {
    const currentPayload: ClientPayload | undefined = client.payloads.find(payload => payload.id === client.currentPayloadId)

    if (currentPayload !== undefined) {
        return currentPayload[field]
    }

    return undefined
}

function startBackupRestore() {
    showBackupRestoreModal.value = true
}

function downloadBackup() {
    const localStorageData = JSON.stringify(localStorage)
    const blob = new Blob([localStorageData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const isoDate = new Date().toISOString().split('T')[0]
    link.download = `Socketfox_${isoDate}.json`
    link.click()
    URL.revokeObjectURL(url)
    link.remove()
}


type LocalStorageKeyValue = {
    [key: string]: string
}

async function readFileAsJson(file: File): Promise<LocalStorageKeyValue> {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onload = (event: any) => {
            try {
                const jsonData = JSON.parse(event.target.result)
                resolve(jsonData)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = (event: any) => {
            reject(event.error)
        }

        reader.readAsText(file)
    })
}

function handleRestoreFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if(input.files?.length) {
        fileToRestore.value = input.files[0]
    }
}

async function restoreBackup() {
    try {
        const data: LocalStorageKeyValue = await readFileAsJson(fileToRestore.value as File)

        if(!confirm('This will clear all your existing data in this app and restore whatever is in the backup you select. Are you sure you want to continue?')) {
            return
        }

        localStorage.clear()

        for(const key in data) {
            localStorage.setItem(key, data[key])
        }

        alert('Backup restored successfully')

        window.location.reload()
    } catch(e) {
        console.log(e)
        alert('Invalid backup file given')
    }
}

// Watch

const localStoragePrefix = 'WebSocket-Client-'

const localStorageKeys = {
    projects: localStoragePrefix + 'projects',
    selectedProjectId: localStoragePrefix + 'selectedProjectId',
    clients: localStoragePrefix + 'clients',
    sendInterceptorCode: localStoragePrefix + 'sendInterceptorCode',
    receiveInterceptorCode: localStoragePrefix + 'receiveInterceptorCode',
    interceptorsStatus: localStoragePrefix + 'interceptorsStatus',
    showSidebar: localStoragePrefix + 'showSidebar'
}

watch(
    projects,
    () => {
        localStorage.setItem(
            localStorageKeys.projects,
            JSON.stringify(projects.value)
        )
    },
    { deep: true }
)

watch(selectedProjectId, () => {
    localStorage.setItem(
        localStorageKeys.selectedProjectId,
        selectedProjectId.value
    )
})

watch(
    clients,
    () => {
        localStorage.setItem(
            localStorageKeys.clients + `-${selectedProjectId.value}`,
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

watch(showSidebar, () => {
    localStorage.setItem(
        localStorageKeys.showSidebar,
        JSON.stringify(showSidebar.value)
    )
})

// Lifecycle Events

onBeforeMount(() => {
    const savedProjects = localStorage.getItem(localStorageKeys.projects)
    if (savedProjects) {
        projects.value = JSON.parse(savedProjects)
        const savedSelectedProjectId = localStorage.getItem(localStorageKeys.selectedProjectId)
        if(savedSelectedProjectId) {
            selectedProjectId.value = savedSelectedProjectId
        } else {
            selectedProjectId.value = projects.value[0].id
        }
    } else {
        const initialProject = {
            id: generateId(),
            name: 'My Project'
        }
        projects.value = [initialProject]
        selectedProjectId.value = initialProject.id
    }

    loadSavedClients(selectedProjectId.value)

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

    const savedShowSidebar = localStorage.getItem(
        localStorageKeys.showSidebar
    )
    if (savedShowSidebar) {
        showSidebar.value = JSON.parse(savedShowSidebar)
    }
})

onMounted(() => {
    document.addEventListener('click', hideContextMenusWhenClickedOutside)
    document.addEventListener('contextmenu', hideContextMenusWhenClickedOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', hideContextMenusWhenClickedOutside)
    document.removeEventListener('contextmenu', hideContextMenusWhenClickedOutside)
})
</script>

<style scoped>
.client-container {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100%;
}

.client-sidebar {
    height: 100%;
    overflow-y: auto;
    border: 1px solid var(--default-border-color);
    width: 10rem;
    padding: 0.5rem;
}

.client-sidebar > .client-sidebar-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-left: 0.5rem;
    padding-right: 0.1rem;
    cursor: pointer;
}

.client-sidebar > .client-sidebar-item.client-sidebar-item-selected {
    background-color: cadetblue;
    color: white;
}

.client-sidebar > .client-sidebar-item > .client-sidebar-item-menu {
    visibility: hidden;
    border-radius: 10px;
}

.client-sidebar > .client-sidebar-item:hover > .client-sidebar-item-menu,
.client-sidebar > .client-sidebar-item > .client-sidebar-item-menu.client-sidebar-item-menu-disable-hide {
    visibility: visible;
}

.client-sidebar > .client-sidebar-item.client-sidebar-item-selected > .client-sidebar-item-menu svg {
    fill: white;
}

.client-sidebar > .client-sidebar-item > .client-sidebar-item-menu:hover,
.client-sidebar > .client-sidebar-item > .client-sidebar-item-menu.client-sidebar-item-menu-disable-hide {
    background-color: rgba(240, 248, 255, 0.233);
}

.client-sidebar > .client-sidebar-item:not(.client-sidebar-item-selected) > .client-sidebar-item-menu:hover,
.client-sidebar > .client-sidebar-item:not(.client-sidebar-item-selected) > .client-sidebar-item-menu.client-sidebar-item-menu-disable-hide {
    background-color: rgb(108 194 197 / 20%);
}

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

.client:first-child {
    border-left: 0;
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

.context-menu {
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 1px 1px 8px -4px black;
}

.context-menu > div {
    padding: 0.3rem 0.5rem;
    cursor: pointer;
}

.context-menu > div:hover {
    background-color: slateblue;
    color: white;
}
</style>
