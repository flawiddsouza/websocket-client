<template>
    <div class="d-f flex-ai-c">
        <div class="d-f o-a">
            <div
                v-for="tab in tabs"
                class="tab"
                :ref="element => tabRefs[tab.id] = element"
                :class="{ 'tab-active': tab.id === currentTabId }"
                @click="$emit('change-tab', tab)"
                @click.middle="closeTab(tab)"
            >
                {{ tab.name !== '' ? tab.name : 'Untitled' }}
                <button class="icon" @click.stop="closeTab(tab)">
                    x
                </button>
            </div>
        </div>
        <div class="ml-0_5rem">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface tab {
    id: string,
    name: string
}

export default defineComponent({
    props: {
        tabs: {
            type: Array as PropType<tab[]>,
            required: true
        },
        currentTabId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tabRefs: {} as any
        }
    },
    watch: {
        currentTabId() {
            this.$nextTick(() => {
                this.tabRefs[this.currentTabId].scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                })
            })
        }
    },
    methods: {
        closeTab(tabToClose: tab) {
            let tabToOpen: tab | null = null

            if(this.currentTabId === tabToClose.id) {
                const tabIndex = this.tabs.findIndex(tab => tab.id === tabToClose.id)

                const tabIndexLeft = tabIndex - 1
                const tabIndexRight = tabIndex + 1

                tabToOpen = tabIndexLeft >= 0 ? this.tabs[tabIndexLeft] : (tabIndexRight <= this.tabs.length - 1 ? this.tabs[tabIndexRight] : null)
            }

            this.$emit('close-tab', { tabToClose, tabToOpen })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.tabRefs[this.currentTabId].scrollIntoView({
                behavior: 'auto',
                block: 'center'
            })
        })
    }
})
</script>

<style scoped>
.tab {
    border: 1px solid lightgrey;
    padding: 0.3rem;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 0.2rem;
    padding-left: 0.5rem;
}

.tab:not(:first-child) {
    border-left: 0;
}

.tab-active {
    background-color: cadetblue;
    color: white;
    border-color: cadetblue;
}
</style>
