<template>
    <div class="nodrag">
        <div v-for="(point, index) in sources" :key="'source' + index" :id="'source' + index"
            :class="{ absolute: 1, pointCircle: 1, colorYellow: point.show }"
            :style="{ top: point.y + 'px', left: point.x + 'px', width: point.width + 'px', height: point.height + 'px', 'z-index': 55 }"
            @mousedown="drag(point)" @click="$emit('click', point)">
        </div>

        <div :style="{ display: source ? '' : 'none' }">
            <div class="" v-for="(point, index) in targets.filter(x => x)" :key="'target' + index">
                <div :class="{ absolute: 1, pointCircle: 1, colorYellow: target != point, colorGreen: target == point }"
                    :style="{ top: point.y + 'px', left: point.x + 'px', width: point.width + 'px', height: point.height + 'px', 'z-index': 60 }">
                </div>
                <div class="absolute text-center textVerticalCenter text-shadow-black colorWhite"
                    :style="{ top: point.y + 'px', left: point.x + 'px', width: point.width + 'px', height: point.height + 'px', 'z-index': 60 }">
                    <div>{{ point.text }}</div>
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
    </div>
</template>

<style>
html {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    position: relative;
}

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
    props: ['id', 'sources', 'freeze'],
    components: { arrowDiv },
    data: () => ({
        delay: 1500,
        animations: [],
        mouse: { x: 0, y: 0 },
        color: "red",
        targets: [],
        source: null,
        target: null
    }),
    watch: {
        sources() { this.resetSources(); }
    },
    mounted() {
        window.addEventListener('mousemove', this.updateMouse);
        window.addEventListener('mouseup', this.mouseUp);
        window.addEventListener('touchmove', this.updateMouse);
        window.addEventListener('touchend', this.mouseUp);
        this.resetSources();
    },
    beforeUnmount() {
        window.removeEventListener('mousemove', this.updateMouse);
        window.removeEventListener('mouseup', this.mouseUp);
        window.removeEventListener('touchmove', this.updateMouse);
        window.removeEventListener('touchend', this.mouseUp);
    },
    methods: {
        updateMouse(e) {
            const touch = e && e.touches && e.touches.length > 0 ? e.touches[0] : {};
            this.mouse.x = e.clientX ? e.clientX : touch.clientX;
            this.mouse.y = e.clientY ? e.clientY : touch.clientY;
            this.updateAnimation();
        },
        resetSources() {
            this.sources.forEach((point, index) => {
                const element = document.getElementById("source" + index);
                element?.addEventListener('touchstart', () => this.drag(point));
            });
            this.animate();
        },
        drag(point) {
            if (this.freeze)
                return;
            this.source = point;
            this.targets = this.source.targets;
            this.animate();
        },
        mouseUp() {
            if (!this.source || !this.animations || this.animations.length < 1 || this.freeze)
                return;
            this.$emit('drop', { mouse: this.mouse, source: this.source, target: this.target });
            this.source = null;
        },
        animate() {
            if (!this.source)
                return;

            this.updateAnimation();

            helperAnimation.animateMultiple(this.animations, this.delay - 5);
            setTimeout(() => {
                this.animate();
            }, this.delay + 15);
        },
        isInside(x, y, box) {
            const minX = box.x;
            const minY = box.y;
            const maxX = minX + box.width;
            const maxY = minY + box.height;
            return (x >= minX && x <= maxX) && (y >= minY && y <= maxY);
        },
        updateAnimation() {
            if (!this.source)
                return;

            if (!this.animations || this.animations.length < 1) {
                this.animations = [
                    this.createAnimation('arrow0' + this.id, false),
                    this.createAnimation('arrow1' + this.id, true)
                ];
            }

            this.target = this.targets.find(box => this.isInside(this.mouse.x, this.mouse.y, box));

            this.color = this.target ? 'green' : 'red';
            const from = { x: this.source.x + (this.source.width / 2), y: this.source.y + (this.source.height / 2) };
            const destination = !this.target ? this.mouse
                : { x: this.target.x + (this.target.width / 2), y: this.target.y + (this.target.height / 2) };

            this.animations.forEach(animation => {
                const rotation = this.getAngleDeg(from, destination) + 135;
                const width = this.target ? 75 : 75;
                const widthHalf = width / 2
                animation.from.x = from.x;
                animation.from.y = from.y;
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
                opacity: 1,
                width: 5,
                height: 5
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