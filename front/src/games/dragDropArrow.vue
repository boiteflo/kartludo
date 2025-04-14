<template>
    <div :style="{ display: stop ? 'none' : '' }">
        <div class="fadeIn" v-for="(point, index) in targets" :key="'target' + index">
            <div :class="{ absolute: 1, pointCircle: 1, colorYellow: target != point, colorGreen: target == point }"
                :style="{ top: (point.y - 37.5) + 'px', left: (point.x - 37.5) + 'px' }"
                @mouseover="mouseoverCursor(point)" @mouseout="mouseoverCursor(null)">
            </div>
            <div class="absolute text-center textVerticalCenter text-shadow-black colorWhite"
                :style="{ top: (point.y - 20) + 'px', left: (point.x - 40) + 'px', width: '80px', height: '40px', 'pointer-events': 'none' }">
                {{ point.text }}
            </div>
        </div>

        <div :style="{ 'pointer-events': 'none' }">
            <div :id="'arrow0' + id" class="absolute" style="top:0px; left:0px; width:0px; height:0px;">
                <arrow-div :color="color"></arrow-div>
            </div>
            <div :id="'arrow1' + id" class="absolute" style="top:0px; left:0px; width:0px; height:0px;">
                <arrow-div :color="color"></arrow-div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.arrow {
    width: 25px;
    height: 25px;
    transform-origin: center center;
    pointer-events: none
}
</style>

<script>
import helperAnimation from '../helpers/helperAnimation';
import arrowDiv from './arrowDiv.vue';

export default {
    name: 'drag-drop-arrow',
    props: ['id', 'source', 'targets'],
    components: { arrowDiv },
    data: () => ({
        delay: 1500,
        animations: [],
        mouse: { x: 0, y: 0 },
        color: "red",
        stop: true,
        target: null
    }),
    watch: {
        source() { this.reset(); }
    },
    mounted() {
        window.addEventListener('mousemove', this.updateMouse);
        window.addEventListener('mouseup', this.mouseUp);
        this.reset();
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.updateMouse);
        window.removeEventListener('mouseup', this.mouseUp);
    },
    methods: {
        updateMouse(e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateAnimation();
        },
        mouseUp() {
            if (!this.source || !this.animations || this.animations.length < 1)
                return;
            this.stop = true;
            this.$emit('drop', { mouse: this.mouse, source: this.source, target: this.target });
        },
        reset() {
            if (!this.source)
                return;
            this.stop = false;
            this.animate();
            setInterval(() => {
                this.animate();
            }, this.delay + 15);
        },
        mouseoverCursor(target) {
            this.target = target;
        },
        animate() {
            if (!this.source || this.stop)
                return;

            this.updateAnimation();

            helperAnimation.animateMultiple(this.animations, this.delay - 5);
        },
        updateAnimation() {
            if (!this.source || this.stop)
                return;

            if (!this.animations || this.animations.length < 1) {
                this.animations = [
                    this.createAnimation('arrow0' + this.id, false),
                    this.createAnimation('arrow1' + this.id, true)
                ];
            }

            this.color = this.target ? 'green' : 'red';
            const destination = this.target ? this.target : this.mouse;

            this.animations.forEach(animation => {
                const rotation = this.getAngleDeg(this.source, destination) + 135;
                const width = this.target ? 75 : 75;
                const widthHalf = width / 2
                animation.from.x = this.source.x;
                animation.from.y = this.source.y;
                animation.from.rotation = rotation;
                animation.to.rotation = rotation;
                animation.to.x = destination.x;
                animation.to.y = destination.y;
                animation.mid.x = (animation.from.x + (animation.to.x - animation.from.x) / 2) - widthHalf;
                animation.mid.y = (animation.from.y + (animation.to.y - animation.from.y) / 2) - widthHalf;
            });
        },
        createAnimation(id, delay) {
            const width = this.target ? 75 : 75;
            const from = {
                width: 5,
                height: 5,
                opacity: 0
            };
            const mid = {
                opacity: 1,
                width,
                height: width
            };

            const to = {
                opacity: 0,
                width: 0,
                height: 0
            };
            return { id, from, mid, to, delay, isIncrement: false };
        },
        getAngleDeg(source, target) {
            const angleRad = Math.atan2(target.y - source.y, target.x - source.x);
            return angleRad * (180 / Math.PI);
        }
    }
}
</script>