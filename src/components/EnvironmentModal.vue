<template>
    <form @submit.prevent="done" v-if="showModalComp">
        <modal :title="`Environment (JSON Format) — ${project?.name}`" v-model="showModalComp" height="70vh" width="55rem">
            <CodeMirrorEditor v-model="environment" lang="json"></CodeMirrorEditor>
            <div style="margin-top: 1rem">
                <div v-if="parseError" class="box">{{ parseError }}</div>
                <div class="box box-hidden" v-else>
                    Spacer Text
                </div>
            </div>

            <template #footer>
                <button>Done</button>
            </template>
        </modal>
    </form>
</template>

<script lang="ts">
import Modal from './Modal.vue'
import CodeMirrorEditor from './CodeMirrorEditor.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        showModal: Boolean,
        project: {
            type: Object,
            required: true
        }
    },
    components: {
        Modal,
        CodeMirrorEditor
    },
    data() {
        return {
            environment: '{}',
            parseError: ''
        }
    },
    computed: {
        showModalComp: {
            get() {
                return this.showModal
            },
            set(value: boolean) {
                this.$emit('update:showModal', value)
            }
        }
    },
    watch: {
        project() {
            this.environment = this.project?.environment ? JSON.stringify(this.project.environment, null, 4) : '{}'
        },
        environment() {
            let environment = {}
            try {
                environment = JSON.parse(this.environment)
                this.parseError = ''
                this.project.environment = environment
            } catch(e: any) {
                this.parseError = e.message
            }
        },
        showModal() {
            if(this.showModal) {
                this.environment = this.project?.environment ? JSON.stringify(this.project.environment, null, 4) : '{}'
            }
        }
    },
    methods: {
        async done() {
            this.showModalComp = false
        }
    }
})
</script>

<style scoped>
.box {
    padding: 0.6rem;
    border: 1px dotted #d04444;
    border-radius: 0.3rem;
}

.box-hidden {
    border: 1px dotted transparent;
    visibility: hidden;
}
</style>
