<template>
    <v-container>
        <v-row justify="center">
            <v-col>
                <div ref="editor" class="quill-editor"></div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
    name: 'text-quill',
    props: ['text'],
    data() {
        return {
            quill: null
        };
    },
    mounted() {
        // Initialisation de l'éditeur Quill
        this.quill = new Quill(this.$refs.editor, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'], // Options de mise en forme
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ],
            },
        });
        this.quill.root.innerHTML = this.text;
        this.quill.on('text-change', this.onTextChange);
    },
    methods: {
        onTextChange() {
            this.$emit('change', this.quill.root.innerHTML);
            const editor = this.$refs.editor;
            editor.style.height = 'auto';
            editor.style.height = editor.scrollHeight + 'px';
        },
    },
};
</script>