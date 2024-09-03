<template>
    <div>
        <div class="flex" style="border:1px black solid; width:278px;margin:5px; overflow: hidden;">
            <img style="width:80px; height: 80px; object-fit: cover; background:#F0F0F0; padding:5px" :src="getImage()">
            <div>
                <input style="width:238px;" type="file" @change="uploadImage" />
                <v-btn v-if="image" class="s40 m5px" @click="removeImage">
                    <v-icon> mdi-close</v-icon> Supprimer
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'button-image',
    props: ['image'],
    data: () => ({
        isStillHover: false,
        isFirstLoad: true,
        imageModified: null,
    }),
    methods: {
        getImage(){
            if(this.isFirstLoad){
                this.isFirstLoad = false;
                this.imageModified = this.image;
            }
            return this.imageModified;
        },
        uploadImage(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imageModified = event.target.result;
                    this.$emit('change', this.imageModified);
                };
                reader.readAsDataURL(file);
            }
        },
        removeImage() {
            this.imageModified = null;
            this.$emit('change', this.imageModified);
        },
    }
}
</script>
