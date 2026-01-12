export class InputHandler{
    constructor() {
        this.x = 0;
        this.y = 0;

        // desktop WSAD
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowUp' || e.key === 'w') && this.keys.indexOf('up') === -1) this.keys.push('up');
            if ((e.key === 'ArrowDown' || e.key === 's') && this.keys.indexOf('down') === -1) this.keys.push('down');
            if ((e.key === 'ArrowLeft' || e.key === 'a') && this.keys.indexOf('left') === -1) this.keys.push('left');
            if ((e.key === 'ArrowRight' || e.key === 'd') && this.keys.indexOf('right') === -1) this.keys.push('right');
        });

        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.splice(this.keys.indexOf('up'), 1);
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.splice(this.keys.indexOf('down'), 1);
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.splice(this.keys.indexOf('left'), 1);
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.splice(this.keys.indexOf('right'), 1);
        });

        // mobile touch
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchActive = false;
        this.joystickThreshold = 50;

        window.addEventListener('touchstart', e => {
            this.touchActive = true;
            this.touchStartX = e.changedTouches[0].pageX;
            this.touchStartY = e.changedTouches[0].pageY;
        });

        window.addEventListener('touchmove', e => {
            if (!this.touchActive) return;
            const touchX = e.changedTouches[0].pageX;
            const touchY = e.changedTouches[0].pageY;

            const dx = touchX - this.touchStartX;
            const dy = touchY - this.touchStartY;

            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance > 0) {
                this.x = dx / distance;
                this.y = dy / distance;

                if (distance < this.joystickThreshold) {
                    const speedFactor = distance / this.joystickThreshold;
                    this.x *= speedFactor;
                    this.y *= speedFactor;
                }
            }
        });

        window.addEventListener('touchend', e => {
            this.touchActive = false;
            this.x = 0;
            this.y = 0;
        });
    }

    // method for desktop keyboard WSAD
    update() {
        if (this.touchActive) return;

        this.x = 0;
        this.y = 0;
        if (this.keys.includes('up')) this.y = -1;
        if (this.keys.includes('down')) this.y = 1;
        if (this.keys.includes('left')) this.x = -1;
        if (this.keys.includes('right')) this.x = 1;

        // normalization for keyboard
        if (this.x !== 0 && this.y !== 0) {
            this.x *= 0.71;
            this.y *= 0.71;
        }
    }
}