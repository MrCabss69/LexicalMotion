class CanvasManager {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
        this.setupResizeListener();
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);

        // Emitir un evento personalizado con las dimensiones antiguas y nuevas
        const event = new CustomEvent('canvasResized', {
            detail: {
                oldWidth: oldWidth,
                oldHeight: oldHeight,
                newWidth: this.canvas.width,
                newHeight: this.canvas.height
            }
        });
        this.canvas.dispatchEvent(event);
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    getCanvas() { return this.canvas; }
    getContext() { return this.ctx; }
    getWidth() { return this.canvas.width; }
    getHeight() { return this.canvas.height; }
}