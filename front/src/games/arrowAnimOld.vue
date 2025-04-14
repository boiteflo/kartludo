<template>
    <div class="arrow" :style="getArrowStyle()">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<style scoped>
.arrow {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: white;
    transform-origin: bottom center;
}

.arrow span {
    display: block;
    width: 25px;
    height: 25px;
    border-top: 5px solid red;
    border-left: 5px solid red;
    animation: animate 2s infinite;
}

.arrow span:nth-child(2) {
    animation-delay: 0.2s;
}

.arrow span:nth-child(3) {
    animation-delay: 0.4s;
}


@keyframes animate {
    0% {
        opacity: 0;
        transform: rotate(45deg) translate(800%, 800%);
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: rotate(45deg) translate(0%, 0%);
    }
}
</style>

<script>
export default {
    name: 'arrow-anim',
    props: ['sourcex', 'sourcey', 'targetx', 'targety'],
    methods: {
        getArrowStyle() {
            const width = 25;
            const height = this.getDistance(this.targetx, this.targety, this.sourcex, this.sourcey);
            const degree = this.getAngleDeg(this.targetx, this.targety, this.sourcex, this.sourcey);
            const left = this.sourcex - (width / 2);
            const top = this.sourcey - height;
            return {
                width: width + 'px', height: height + 'px',
                left: left + 'px', top: top + 'px',
                transform: `rotate(-${degree}deg)`
            }
        },
        getDistance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        },
        getAngleDeg(sourceX, sourceY, targetX, targetY) {
            const angleRad = Math.atan2(targetY - sourceY, targetX - sourceX);
            return angleRad * (180 / Math.PI);
        }
    }
}
</script>