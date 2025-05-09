<template>
    <div class="h100p w100p relative bgWhite">
        <div class="div3d">
            <div class="plan-incline"></div>
        </div>

        <h2>Page Test</h2>

        <drag-drop-arrow id="0" :sources="points" @drop="dropPoint">
        </drag-drop-arrow>

        <div :class="{ bgRed: 1, 'anim-height': 1, 'height0': popupShow }"
            style="width:500px; height: 500px; transform:scale(0.5)">

        </div>
        <button id="moveButton">Bouge-moi !</button>

        <div class="bgYellow absolute" style=" top:50px; left:500px; width:300px; height: 150px;">
            <div class="relative w100p h100p">
                <div class="bgRed absolute"
                    style="width:25px; height:25px; transform:rotate(45deg); top:45%; right:-12.5px"></div>
                <div class="bgRed absolute"
                    style="width:25px; height:25px; transform:rotate(45deg); left:45%; top:-12.5px"></div>
                <div class="bgRed absolute"
                    style="width:25px; height:25px; transform:rotate(45deg); top:45%; left:-12.5px"></div>
                <div class="bgRed absolute"
                    style="width:25px; height:25px; transform:rotate(45deg); left:45%; bottom:-12.5px"></div>
            </div>
        </div>

        <div id="divToMove" class="absolute bgGreen" style="top:200px; left:200px; width:50px; height:50px;">

        </div>
    </div>
</template>

<style>
#moveButton {
    position: absolute;
    top: 100px;
    left: 100px;
    padding: 10px 20px;
    font-size: 16px;
    transition: top 0.5s ease, left 0.5s ease;
    background-color: red;
}

.div3d {
    position: absolute;
    width: 100%;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    perspective: 800px;
    /* Important pour voir la transformation 3D */
}

.plan-incline {
    width: 300px;
    height: 300px;
    background: linear-gradient(to bottom right, #3498db, #9b59b6);
    transform: rotateX(45deg);
    transform-style: preserve-3d;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
</style>

<script>
import helperAnimation from '../helpers/helperAnimation';
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

        const button = document.getElementById('moveButton');

        button.addEventListener('click', () => {
            const x = Math.floor(Math.random() * 401) + 100; // 100 à 500
            const y = Math.floor(Math.random() * 401) + 100; // 100 à 500

            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
        });
        
        setInterval(() => {
            const x = Math.floor(Math.random() * 401) + 100;
            const y = Math.floor(Math.random() * 401) + 100;
            const animations = [{ id: 'divToMove', to: {x, y, width:75, height:75, rotation:0, opacity:1}}];
            helperAnimation.animateMultipleByCss(animations, 500);
        }, 3000);

    },
    methods: {
        dropPoint(event) {
            alert(JSON.stringify(event));
            this.source = null;
        }
    }
};
</script>