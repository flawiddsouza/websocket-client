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
                <div style="height: 1.4rem" class="client-sidebar-item-menu" @click.stop="showProjectContextMenu($event, project)">
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
                <button @click="addClient">Add Client</button>
            </div>
            <div class="clients">
                <template v-for="client in clients">
                    <div
                        class="client"
                        v-if="!client.visibility || client.visibility === 'shown'"
                    >
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
                                        <td style="width: 100%; white-space: pre">
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
    <div class="context-menu" :style="{ top: showProjectContextMenuPopupCoords.y, left: showProjectContextMenuPopupCoords.x }" v-if="showProjectContextMenuPopup">
        <div @click="renameProject">Rename</div>
        <div @click="deleteProject">Delete</div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch, nextTick, onBeforeMount, reactive, onMounted, onUnmounted } from 'vue'
import { Client, Project } from '../types'
import { formatTimestamp, generateId } from '../helpers'
import Modal from './Modal.vue'
import CodeMirrorEditor from './CodeMirrorEditor.vue'

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
const clickedContextMenuProject = ref({ id: '', name: '' })
const showProjectContextMenuPopup = ref(false)
const showProjectContextMenuPopupCoords = ref({
    x: '',
    y: ''
})

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

function renameProject() {
    const newProjectName = prompt('Enter new project name', clickedContextMenuProject.value.name)

    if(!newProjectName || newProjectName.trim() === '') {
        showProjectContextMenuPopup.value = false
        return
    }

    clickedContextMenuProject.value.name = newProjectName

    showProjectContextMenuPopup.value = false
}

function deleteProject() {
    if(projects.value.length === 1) {
        alert('Cannot delete project as there\'s only one project left')
        showProjectContextMenuPopup.value = false
        return
    }

    if(!confirm('Are you sure you want to delete this project?')) {
        showProjectContextMenuPopup.value = false
        return
    }

    projects.value = projects.value.filter(project => project.id !== clickedContextMenuProject.value.id)

    localStorage.removeItem(localStorageKeys.clients + `-${clickedContextMenuProject.value.id}`)

    if(clickedContextMenuProject.value.id === selectedProjectId.value) {
        setSelectedProject(projects.value[0].id)
    }

    showProjectContextMenuPopup.value = false
}

function addClient() {
    clients.value.push({
        projectId: selectedProjectId.value,
        id: generateId(),
        url: '',
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

function connect(client: Client) {
    if (client.url === '') {
        return
    }
    client.ws = new WebSocket(client.url)
    client.ws.addEventListener('message', async (e) => {
        let receivedMessage = e.data

        if (interceptorsStatus.value !== 'Disabled') {
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

    client.ws.addEventListener('close', async () => {
        disconnect(client)
    })
}

async function sendMessage(client: Client) {
    if (client.message === '') {
        return
    }

    let messageToSend = client.message

    if (interceptorsStatus.value !== 'Disabled') {
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

function loadSavedClients(projectId: string) {
    const savedClients = localStorage.getItem(localStorageKeys.clients + `-${projectId}`)
    if (savedClients) {
        clients.value = JSON.parse(savedClients)
        clients.value.forEach((client) => {
            if (client.visibility !== 'hidden') {
                scrollToBottomClientMessages(client.id, false)
            }
        })
    } else {
        const initialClient: Client = {
            projectId: projectId,
            id: generateId(),
            url: '',
            message: '',
            messages: [],
            ws: null,
            visibility: 'shown'
        }
        clients.value = [initialClient]
    }
}

function showProjectContextMenu(event: MouseEvent, project: Project) {
    clickedContextMenuProject.value = project
    showProjectContextMenuPopupCoords.value.x = (event.clientX - 14) + 'px'
    showProjectContextMenuPopupCoords.value.y = (event.clientY + 14) + 'px'
    showProjectContextMenuPopup.value = true
}

function hideContextMenusWhenClickedOutside(event: Event) {
    const target = document.querySelector('.context-menu')

    const withinBoundaries = event.composedPath().includes(target as EventTarget)

    if (!withinBoundaries) {
        showProjectContextMenuPopup.value = false
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
}

.client-sidebar > .client-sidebar-item:hover > .client-sidebar-item-menu {
    visibility: visible;
}

.client-sidebar > .client-sidebar-item:hover.client-sidebar-item-selected > .client-sidebar-item-menu svg {
    fill: white;
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
