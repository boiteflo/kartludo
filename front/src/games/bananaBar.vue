<template>
    <div class="relative" style="width: 100px; height: 100px;">
        <div class="banana absolute" :style="getBananaStyle(isdown, color, value)"></div>
        <div v-if="istext" class="text absolute text-center"
            :style="{ ...getTextStyle(isdown, value), 'background-color': color }">
            {{ value }}
        </div>
    </div>
</template>

<style scoped>
.banana {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    mask-image: radial-gradient(rgba(0 0 0 /0) 35px, black 40px);
    animation: growArc 1s ease-out forwards;
}

.text {
    color: black;
    background: #FFEB3B;
    border-radius: 50%;
}

@property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
}

@keyframes growArc {
    from {
        --angle: 0deg;
    }

    to {
        --angle: 160deg;
    }
}
</style>

<script>
export default {
    name: 'banana-bar',
    props: ['value', 'max', 'isdown', 'istext', 'color'],
    methods: {
        getBananaStyle(isPlayer1, color, value) {
            const percent = value * 100 / this.max;
            const angle = isPlayer1 ? 270 : 90;
            const anglePercent = percent * 180 / 100;

            return {
                transform: `rotate(${angle}deg) scaleX(-1)`,
                '--angle': `${anglePercent}deg`,
                background: `conic-gradient(${color} var(--angle), 
                                            transparent var(--angle)`
            };
        },
        getTextStyle(isPlayer1, value) {
            const percent = value * 100 / this.max;
            const leftValue = isPlayer1 ? percent - 15 : 70 - percent + 15;
            const topValue = this.getParabolicY(isPlayer1, percent);
            return { width: 25 + 'px', height: 25 + 'px', left: leftValue + 'px', top: topValue + 'px' };
        },
        getParabolicY(isPlayer1, percent) {
            const base = isPlayer1 ? 40 : 30;
            const halfIndex = -0.02 * Math.pow(percent - 50, 2) + 50;
            const sens = isPlayer1 ? 1 : -1;
            return base + halfIndex * sens * 0.75;
        }
    }
}
</script>