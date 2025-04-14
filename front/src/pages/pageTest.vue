<template>
    <div class="h100p w100p relative bgWhite">
        <h2>Page Test</h2>

        <drag-drop-arrow id="0" :sources="points" @drop="dropPoint">
        </drag-drop-arrow>
    </div>
</template>

<style></style>

<script>
import dragDropArrow from '../games/dragDropArrow.vue';

export default {
    name: 'pageTest',
    components: { dragDropArrow },
    data: () => ({
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

        this.points[0].targets =targetsUp;
        this.points[1].targets =targetsDown;
    },
    methods: {
        dropPoint(event) {
            alert(JSON.stringify(event));
            this.source = null;
        }
    }
};
</script>