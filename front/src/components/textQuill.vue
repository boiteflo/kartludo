<template>
    <div>
        <v-container class="relative">
            <v-row justify="center">
                <v-col>
                    <div ref="editor" style="min-height: 40px;" class="quill-editor"></div>
                    <div v-if="showHtml" class="borderBlack w100p h100p m5px absolute t0px bgWhite" style="z-index:2">
                        <textarea @input="onTextareaChange" v-model="txt" class="w100p h100p"
                            style="z-index:2"></textarea>

                        <v-btn class="w100p m5px bg2" @click="setShowHtmml(false)">
                            <v-icon> mdi-edit</v-icon> Modifier via l editeur
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <div v-if="textarea" class="flex absolute t10px r10px">
                <v-btn class="s40 m5px absolute t0px" @click="setShowHtmml(true)">
                    <v-icon> mdi-edit</v-icon> Modifier en html
                </v-btn>
            </div>
            <slot></slot>
        </v-container>
    </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
    name: 'text-quill',
    props: ['text', 'textarea'],
    data() {
        return {
            showHtml: false,
            quill: null,
            txt: ''
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
                    [{ 'align': [] }], // Alignement
                    [{ 'color': [] }, { 'background': [] }], // Couleur du texte et du fond
                    ['clean'] // Bouton pour retirer la mise en forme
                ],
            },
            formats: [
                'font', 'size', 'bold', 'italic', 'underline', 'color', 'background', 'align', 'link', 'image'
            ]
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
        setShowHtmml(value) {
            if (value)
                this.txt = this.quill.root.innerHTML;
            else
                 this.quill.root.innerHTML = this.txt;
            this.showHtml = value;
        },
        onTextareaChange() {
            this.$emit('change', this.txt);
        }
    },
};
</script>