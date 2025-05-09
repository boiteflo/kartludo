class helperAnimation {

    static animateElement(element, from, to, duration) {
        const anim = { element, from, to };
        this.animateElements([anim], duration);
    }
    static animateElements(animations, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            function getAnimValue(property, anim, time) {
                let t = time;
                let from = null;
                let to = null;
                let progress = 0;

                if (anim.delay) {
                    t = (t < 0.5) ? (t + 0.5) : (t - 0.5);
                }

                if (!anim.mid || !anim.mid[property]) {
                    progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    from = anim.from;
                    to = anim.to;
                }
                else if (t < 0.5) {
                    t = t / 0.5;
                    progress=t;
                    from = anim.from;
                    to = anim.mid;
                } else {
                    t = (t - 0.5) / 0.5;
                    progress=t;
                    from = anim.mid;
                    to = anim.to;
                }

                return from[property] + (to[property] - from[property]) * progress;
            }

            const elapsedTime = currentTime - startTime;
            const t = Math.min(elapsedTime / duration, 1); // de 0 à 1

            animations.forEach(anim => {
                const currentX = getAnimValue('x', anim, t);
                const currentY = getAnimValue('y', anim, t);
                const currentWidth = getAnimValue('width', anim, t);
                const currentHeight = getAnimValue('height', anim, t);
                const currentRotation = getAnimValue('rotation', anim, t);
                const currentOpacity = getAnimValue('opacity', anim, t);

                anim.element.style.left = currentX + "px";
                anim.element.style.top = currentY + "px";
                anim.element.style.height = currentHeight + "px";
                anim.element.style.width = currentWidth + "px";
                anim.element.style.opacity = currentOpacity;
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
        const properties = 'x,y,width,height,rotation,opacity';
        const result = {};
        properties.split(',').forEach(property => {
            result[property] = val1[property];
            const value = val2[property];
            if (value)
                result[property] += value;
        });
        return result;
    }

    static setIfNull(from, mid) {
        const properties = 'x,y,width,height,rotation,opacity';
        const result = {};
        properties.split(',').forEach(property => {
            result[property] = from[property];
            const value = mid[property];
            if (value)
                result[property] = value;
        });
        return result;
    }

    static getRelativeTo0(val1, val2) {
        return { x: val2.x - val1.x, y: val2.y - val1.y };
    }
    static pxStringToInt(value) { return parseInt(value.replace("px", "")); }

    static animate(id, from, to, isIncrement, duration) {
        return this.animateMultiple([{ id, from, to, isIncrement }], duration);
    }

    static animateMultipleByCss(animations, duration) {
        animations.forEach(anim => {
            if (!anim.to) return;
    
            anim.element = document.getElementById(anim.id);
            if (!anim.element) {
                console.log("element can't be found : " + anim.id);
                return;
            }
    
            let delay = "0." + duration + "s";
            anim.element.style.transition = `top ${delay} ease, left ${delay} ease, height ${delay} ease, width ${delay} ease, opacity ${delay} ease, transform ${delay} ease`;
        });
    
        // ⚠️ FORCER LE REPAINT / REFLOW
        animations.forEach(anim => anim.element?.offsetHeight);
    
        // Maintenant appliquer les nouveaux styles
        animations.filter(x => x.element).forEach(anim => {
            anim.element.style.left = anim.to.x + "px";
            anim.element.style.top = anim.to.y + "px";
            anim.element.style.height = anim.to.height + "px";
            anim.element.style.width = anim.to.width + "px";
            anim.element.style.opacity = anim.to.opacity;
            anim.element.style.transform = `rotate(${anim.to.rotation}deg)`;
        });
    }

    static animateMultiple(animations, duration = -1) {
        animations.forEach(anim => {
            if (!anim.to) {
                // console.log("to is missing for animation : " + anim.id);
                return;
            }
            anim.element = document.getElementById(anim.id);
            if (!anim.element) {
                console.log("element can't be found : " + anim.id);
                return;
            }
            anim.from = anim.from ?? {
                x: this.pxStringToInt(anim.element.style.left),
                y: this.pxStringToInt(anim.element.style.top),
                rotation: anim.element.style.rotation,
                height: anim.element.style.height,
                width: anim.element.style.width,
                delay: false
            };
            anim.from.rotation = anim.from.rotation ?? 0;
            anim.from.opacity = anim.from.opacity ?? 1;
            anim.from.height = anim.from.height ?? anim.element.clientHeight;
            anim.to = anim.isIncrement ? this.add(anim.from, anim.to) : anim.to;
            anim.mid = !anim.mid ? null : anim.isIncrement ? this.add(anim.from, anim.mid) : anim.mid;
        });
        this.animateElements(animations, duration);
    }

    /*const newSize = initialSize + (targetSize - initialSize) * easedProgress;
      div.style.width = `${newSize}px`;
      div.style.height = `${newSize}px`;*/

}

module.exports = helperAnimation;
