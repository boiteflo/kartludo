<template>
    <div class="h100p w100p relative bgWhite">
        <h2>Page Test</h2>

        <div v-for="(point, index) in points" :key="'point' + index">
            <div class="absolute pointCircle colorYellow nodrag"
                :style="{ top: (point.x - 37.5) + 'px', left: (point.x - 37.5) + 'px' }"
                @mousedown="dragAndDrop(point)">
            </div>
        </div>

        <arrow-anim id="0" :source="source" :target="target" @drop="dropPoint" :targets="targets">
        </arrow-anim>
    </div>
</template>

<style>
</style>

<script>
import arrowAnim from '../games/dragDropArrow.vue';

export default {
    name: 'pageTest',
    components: { arrowAnim },
    data: () => ({
        points: [
            { x: 240, y: 240 }
        ],
        targets: [
            { x: 40, y: 40 }, { x: 140, y: 40 }, { x: 240, y: 40 }, { x: 340, y: 40 }, { x: 440, y: 40 },
            { x: 40, y: 140 }, { x: 440, y: 140 },
            { x: 40, y: 240 }, { x: 440, y: 240 },
            { x: 40, y: 340 }, { x: 440, y: 340 },
            { x: 40, y: 440 }, { x: 140, y: 440 }, { x: 240, y: 440 }, { x: 340, y: 440 }, { x: 440, y: 440 }
        ],
        source: null,
        target: null
    }),
    mounted() {
        this.targets = this.targets.map((x, index) => { return { ...x, text: 'Points ' + index } });
    },
    methods: {
        dragAndDrop(point) {
            this.source = point;
        },
        mouseoverCursor(target) {
            this.target = target;
        },
        dropPoint(event) {
            console.log(JSON.stringify(event));
            this.source = null;
        }
    }
};
</script>