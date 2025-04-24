<template>
    <div class="h100p w100p relative bgWhite">
        <h2>Page Test</h2>

        <drag-drop-arrow id="0" :sources="points" @drop="dropPoint">
        </drag-drop-arrow>
        <div v-fit-text style="width: 200px; font-size: 32px; overflow: hidden; z-index:200" class="bg">
            Ce texte doit s’adapter à la largeur !
        </div>

        <div :class="{ bgRed: 1, 'anim-height': 1, 'height0': popupShow }"
            style="width:500px; height: 500px; transform:scale(0.5)">

        </div>

        <div class="bgYellow absolute" style=" top:50px; left:500px; width:300px; height: 150px;">
            <div class="relative w100p h100p">
                <div class="bgRed absolute" style="width:25px; height:25px; transform:rotate(45deg); top:45%; right:-12.5px"></div>
                <div class="bgRed absolute" style="width:25px; height:25px; transform:rotate(45deg); left:45%; top:-12.5px"></div>
                <div class="bgRed absolute" style="width:25px; height:25px; transform:rotate(45deg); top:45%; left:-12.5px"></div>
                <div class="bgRed absolute" style="width:25px; height:25px; transform:rotate(45deg); left:45%; bottom:-12.5px"></div>
            </div>
        </div>
    </div>
</template>

<style></style>

<script>
import dragDropArrow from '../games/dragDropArrow.vue';

export default {
    name: 'pageTest',
    components: { dragDropArrow },
    data: () => ({
        popupShow: false,
        game: {
            popup: {
                cards: [],
                text: 'Title',
                choices: [{ text: 'yes' }, { text: 'no' }]
            }
        },
        points: [{ x: 240, y: 240, width: 75, height: 75, show: true }, { x: 40, y: 240, width: 75, height: 75, show: true }]
    }),
    mounted() {
        const targetsUp = [];
        const targetsDown = [];
        const width = 75;
        const height = 75;
        let y = 40;
        for (let x = 40; x < 260; x = x + 100)
            targetsUp.push({ x, y, width, height, text: 'Point ' + x });

        y = 440;
        for (let x = 40; x < 260; x = x + 100)
            targetsDown.push({ x, y, width, height, text: 'Point ' + x });

        this.points[0].targets = targetsUp;
        this.points[1].targets = targetsDown;
        setTimeout(() => {
            this.popupShow = true;
        }, 2000);
    },
    methods: {
        dropPoint(event) {
            alert(JSON.stringify(event));
            this.source = null;
        }
    }
};
</script>