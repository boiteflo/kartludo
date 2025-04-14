<template>
    <div class="absolute" style="top:0px; left:0px;">
        <div class="arrow absolute" :id="'arrow0' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute" :id="'arrow1' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute" :id="'arrow2' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute" :id="'arrow3' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute" :id="'arrow4' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
        <div class="arrow absolute" :id="'arrow5' + id"
            :style="{ 'border-top': '5px solid ' + color, 'border-left': '5px solid ' + color }">
        </div>
    </div>
</template>

<style scoped>
.arrow {
    width: 25px;
    height: 25px;
}
</style>

<script>
import helperAnimation from '../helpers/helperAnimation';

export default {
    name: 'arrow-anim',
    props: ['id', 'source', 'target'],
    data: () => ({
        delay: 1000,
        mouse: { x: 0, y: 0 },
        color: "red"
    }),
    mounted() {
        window.addEventListener('mousemove', this.updateMouse);
        this.animate();
        setInterval(() => {
            this.animate();
        }, this.delay + 15);
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.updateMouse);
    },
    methods: {
        updateMouse(e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        },
        animate() {
            if (!this.source) {
                console.log("no source");
                return;
            }
            this.color = this.target ? 'green' : 'red';

            const animations = [];
            const destination = this.target ? this.target : this.mouse;
            const rotation = this.getAngleDeg(this.source, destination) + 135;
            const sensX = this.source.x === destination.x ? 0 : this.source.x > destination.x ? 1 : -1;
            const sensY = this.source.y === destination.y ? 0 : this.source.y > destination.y ? 1 : -1;
            const arrowPaddingX = Math.min(10, Math.abs(this.source.x - destination.x));
            const arrowPaddingY = Math.min(10, Math.abs(this.source.y - destination.y));

            for (let i = 0; i < 6; i++) {
                const id = 'arrow' + i + this.id;
                const gapMidX = ((i - 3) * arrowPaddingX) * sensX;
                const gapMidY = ((i - 3) * arrowPaddingY) * sensY;
                const from = {
                    x: this.source.x + gapMidX,
                    y: this.source.y + gapMidY,
                    opacity: 0,
                    rotation
                };
                const mid = { opacity: 1 };
                const to = {
                    x: destination.x +gapMidX-12.5,
                    y: destination.y +gapMidY-12.5,
                    opacity: 0,
                    rotation
                };
                animations.push({ id, from, mid, to, isIncrement: false });
            }

            helperAnimation.animateMultiple(animations, this.delay - 5);
        },
        getAngleDeg(source, target) {
            const angleRad = Math.atan2(target.y - source.y, target.x - source.x);
            return angleRad * (180 / Math.PI);
        }
    }
}
</script>