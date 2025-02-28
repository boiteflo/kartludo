class helperAnimation {

    static animateElement(element, from, to, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const t = Math.min(elapsedTime / duration, 1); // de 0 à 1
            const easedProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const currentX = from.x + (to.x - from.x) * easedProgress;
            const currentY = from.y + (to.y - from.y) * easedProgress;

            element.style.left = currentX + "px";
            element.style.top = currentY + "px";

            if (t < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    static add(val1, val2) {
        return { x: val1.x + val2.x, y: val1.y + val2.y };
    }
    static getRelativeTo0(val1, val2) {
        return { x: val2.x - val1.x, y: val2.y - val1.y };
    }
    static pxStringToInt(value){return parseInt(value.replace("px",""));}

    static animate(id, from, to, isIncrement, duration = 500) {
        const element = document.getElementById(id);
        const fromValue = from ?? { x: this.pxStringToInt(element.style.left), y: this.pxStringToInt(element.style.top) };
        const toValue = isIncrement ? this.add(fromValue, to) : to;
        this.animateElement(element, fromValue, toValue, duration);
    }

    /*const newSize = initialSize + (targetSize - initialSize) * easedProgress;
      div.style.width = `${newSize}px`;
      div.style.height = `${newSize}px`;*/

}

module.exports = helperAnimation;
