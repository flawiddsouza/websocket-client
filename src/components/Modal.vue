<template>
    <div class="modal" tabindex="0" @mousedown="closeModalOnBackgroundClick">
        <div class="modal__container" :style="{ width: width }">
            <div class="modal__content">
                <header>
                    <h3>{{ title }}</h3>
                    <span @click="$emit('update:modelValue', false)">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 352 512"
                        >
                            <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
                            <path
                                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                            />
                        </svg>
                    </span>
                </header>
                <div class="modal-main" :style="{ flexBasis: height }">
                    <slot>No Modal Content</slot>
                </div>
                <footer v-if="$slots.footer">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        modelValue: Boolean,
        title: String,
        height: {
            type: String,
            required: false
        },
        width: {
            type: String,
            required: false
        }
    },
    methods: {
        closeModalOnBackgroundClick(e: any) {
            // document.body.contains(e.target) is needed when the clicked element is no longer in the DOM
            // if you don't add it, the orphaned e.target element will close the modal, as its "closest" will
            // not yield the .modal__content class element or any other elements for that matter
            // because it has been removed by the user
            if (
                e.target.closest('.modal__content') === null &&
                document.body.contains(e.target)
            ) {
                this.$emit('update:modelValue', false)
            }
        }
    }
})
</script>

<style scoped>
.modal {
    --gutter: 14px;
    --soft-color: #fafafa;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal__container {
    min-width: 600px;
    max-width: 95vw;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
}

.modal__container header {
    display: grid;
    padding: var(--gutter);
    align-items: center;
    grid-template-columns: auto 20px;
    border-bottom: 1px solid var(--default-border-color);
}

.modal__container header h3 {
    font-weight: normal;
    font-size: 1rem;
    margin: 0;
}

.modal__container header span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 12px;
    width: 12px;
    opacity: 0.8;
    cursor: pointer;
}

.modal__container header span > svg {
    display: block;
}

.modal__container header span:hover {
    opacity: 1;
}

.modal__container .modal-main {
    flex: 1;
    text-align: left;
    overflow: auto;
    padding: 1rem 1.5rem;
    max-height: 62vh;
}

.modal__container footer {
    height: auto;
    text-align: right;
    border-top: solid 1px #cccccc;
    padding: var(--gutter);
    background-color: #ffffff;
    background-color: var(--soft-color);
}

.modal__container footer button,
.modal__container footer input {
    margin: 0;
}

.modal__container footer button:not(:last-child),
.modal__container footer input:not(:last-child) {
    margin-right: var(--gutter);
}

.modal__content {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
