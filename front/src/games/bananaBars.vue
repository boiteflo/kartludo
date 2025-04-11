<template>
    <div class="relative" style="width: 100%; height: 100%;">
        <div class="banana absolute" :style="getBananaStyle(true, '#F44336', p1max)"></div>
        <div class="banana absolute" :style="getBananaStyle(true, '#3F51B5', p1yellow + p1blue)"></div>
        <div class="banana absolute" :style="getBananaStyle(true, '#FFEB3B', p1yellow)"></div>

        <div class="banana absolute" :style="getBananaStyle(false, '#F44336', p2max)"></div>
        <div class="banana absolute" :style="getBananaStyle(false, '#3F51B5', p2yellow + p2blue)"></div>
        <div class="banana absolute" :style="getBananaStyle(false, '#FFEB3B', p2yellow)"></div>

        <div v-if="p1yellow > 0" class="text absolute text-center" :style="getTextStyle(true, p1yellow)">{{ p1yellow }}
        </div>
        <div v-if="p2yellow > 0" class="text absolute text-center" :style="getTextStyle(false, p2yellow)">{{ p2yellow }}
        </div>

        <div v-if="p1blue > 0" class="text absolute text-center bgBlue" :style="getTextStyle(true, p1yellow + p1blue)">
            {{ p1yellow + p1blue }}
        </div>
        <div v-if="p2blue > 0" class="text absolute text-center bgBlue" :style="getTextStyle(false, p2yellow + p2blue)">
            {{ p2yellow + p2blue }}
        </div>
    </div>
</template>

<style scoped>
.banana {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    mask-image: radial-gradient(rgba(0 0 0 /0) 35px, black 40px);
}

.text {
    color: black;
    background: #FFEB3B;
    border-radius: 50%;
}
</style>

<script>
export default {
    name: 'banana-bars',
    props: ['width', 'p1yellow', 'p1blue', 'p2yellow', 'p2blue', 'p1max', 'p2max', 'max'],
    methods: {
        getBananaStyle(isPlayer1, color, value) {
            const percent = value * 100 / this.max;
            const margin = 10;
            const angle = isPlayer1 ? 225 : 45;
            const anglePercent = percent * 180 / 100;
            const anglePercentMinusMargin = anglePercent - margin;
            return {
                transform: `rotate(${angle}deg) scaleX(-1)`,
                background: `conic-gradient(transparent 0deg, 
                                            ${color} ${margin}deg, 
                                            ${color} ${anglePercentMinusMargin}deg, 
                                            transparent ${anglePercent}deg)`
            };
        },
        getTextStyle(isPlayer1, value) {
            const percent = value / this.max;
            const percentIncruise = this.width / 100;
            let leftValue = isPlayer1 ? this.getParabolicY(15, 68, 76, percent) : this.getParabolicY(64, 11, 5, percent);
            leftValue *= percentIncruise;

            let topValue = isPlayer1 ? this.getParabolicY(70, 68, 14, percent) : this.getParabolicY(9, 12, 61, percent);
            topValue *= percentIncruise;

            return { width: 25 + 'px', height: 25 + 'px', left: leftValue + 'px', top: topValue + 'px' };
        },
        getParabolicY(y0, y50, y100, t) {
            const a = 2 * y0 - 4 * y50 + 2 * y100;
            const b = -3 * y0 + 4 * y50 - y100;
            const c = y0;
            return a * t * t + b * t + c;
        }
    }
}
</script>