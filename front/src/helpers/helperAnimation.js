class helperAnimation {

    static animateElement(element, from, to, duration) {
        const anim = { element, from, to };
        this.animateElements([anim], duration);
    }
    static animateElements(animations, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const t = Math.min(elapsedTime / duration, 1); // de 0 à 1
            const easedProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

            animations.forEach(anim => {
                const currentX = anim.from.x + (anim.to.x - anim.from.x) * easedProgress;
                const currentY = anim.from.y + (anim.to.y - anim.from.y) * easedProgress;
                const currentHeight = anim.from.height + (anim.to.height - anim.from.height) * easedProgress;
                const currentWidth = anim.from.width + (anim.to.width - anim.from.width) * easedProgress;
                const currentRotation = anim.from.rotation + (anim.to.rotation - anim.from.rotation) * easedProgress;

                anim.element.style.left = currentX + "px";
                anim.element.style.top = currentY + "px";
                anim.element.style.height = currentHeight + "px";
                anim.element.style.width = currentWidth + "px";
                anim.element.style.transform = `rotate(${currentRotation}deg)`;
            });

            if (t < 1)
                requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    static add(val1, val2) {
        return { x: val1.x + val2.x, y: val1.y + val2.y, rotation: val1.rotation + val2.rotation };
    }
    static getRelativeTo0(val1, val2) {
        return { x: val2.x - val1.x, y: val2.y - val1.y };
    }
    static pxStringToInt(value) { return parseInt(value.replace("px", "")); }

    static animate(id, from, to, isIncrement, duration = global.delay) {
        return this.animateMultiple([{ id, from, to, isIncrement }], duration);
    }

    static animateMultiple(animations, duration = -1) {
        if (duration === -1)
            duration = global.delay;
        const animationsArray = [];
        animations.forEach(anim => {
            if (!anim.to) {
                // console.log("to is missing for animation : " + anim.id);
                return;
            }
            const element = document.getElementById(anim.id);
            if (!element) {
                console.log("element can't be found : " + anim.id);
                return;
            }
            const from = anim.from ?? {
                x: this.pxStringToInt(element.style.left),
                y: this.pxStringToInt(element.style.top),
                rotation: element.style.rotation,
                height: element.style.height,
                width: element.style.width
            };
            from.rotation = from.rotation ?? 0;
            from.height = from.height ?? element.clientHeight;
            const to = anim.isIncrement ? this.add(from, anim.to) : anim.to;
            animationsArray.push({ element, from, to });
        });
        this.animateElements(animationsArray, duration);
    }

    /*const newSize = initialSize + (targetSize - initialSize) * easedProgress;
      div.style.width = `${newSize}px`;
      div.style.height = `${newSize}px`;*/

}

module.exports = helperAnimation;
