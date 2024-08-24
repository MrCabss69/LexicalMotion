// animation_controller.js

class AnimationController {
    constructor(container) {
        this.container = container;
        this.configManager = new ConfigManager();
        this.canvasManager = new CanvasManager(container);
        this.textRenderer = new TextRenderer(this.canvasManager, this.configManager);
        this.particleManager = new ParticleManager(this.canvasManager, this.configManager);
        this.uiManager = new UIManager(this);
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseInContainer = false;
        this.isPaused = false;

        this.setupEventListeners();
        this.particleManager.initParticles();
        this.updateParticleTargets();
    }

    setupEventListeners() {
        window.addEventListener('resize', Utils.debounce(this.handleResize.bind(this), 250));
        this.canvasManager.getCanvas().addEventListener('mousemove', Utils.throttle(this.handlePointerMove.bind(this), 16));
        this.canvasManager.getCanvas().addEventListener('touchmove', Utils.throttle(this.handlePointerMove.bind(this), 16), { passive: false });
        this.canvasManager.getCanvas().addEventListener('mouseenter', () => this.isMouseInContainer = true);
        this.canvasManager.getCanvas().addEventListener('mouseleave', () => this.isMouseInContainer = false);
        this.canvasManager.getCanvas().addEventListener('touchstart', () => this.isMouseInContainer = true);
        this.canvasManager.getCanvas().addEventListener('touchend', () => this.isMouseInContainer = false);
        
    }

    handlePointerMove(e) {
        e.preventDefault();
        const rect = this.canvasManager.getCanvas().getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        this.mouseX = clientX - rect.left;
        this.mouseY = clientY - rect.top;
    }

    handleResize() {
        this.canvasManager.resizeCanvas();
        this.particleManager.adjustParticlesOnResize();
        this.updateParticleTargets();
        this.uiManager.adjustControlsLayout();
    }

    animate(timestamp) {
        if (this.isPaused) return;

        const ctx = this.canvasManager.getContext();
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        
        if (this.configManager.getConfig('TEXT.ANIMATION') !== 'none') {
            this.applyTextAnimation(timestamp);
        }
        
        this.textRenderer.drawGuideText();
        this.particleManager.updateAndDrawParticles(this.mouseX, this.mouseY, this.isMouseInContainer);

        requestAnimationFrame(this.animate.bind(this));
    }

    applyTextAnimation(timestamp) {
        const ctx = this.canvasManager.getContext();
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();
        const centerX = width / 2;
        const centerY = height / 2;
        
        switch(this.configManager.getConfig('TEXT.ANIMATION')) {
            case 'pulse':
                const scale = 1 + 0.05 * Math.sin(timestamp / 500);
                ctx.setTransform(scale, 0, 0, scale, centerX * (1 - scale), centerY * (1 - scale));
                break;
            case 'rotate':
                const angle = Math.sin(timestamp / 1000) * Math.PI / 32;
                ctx.translate(centerX, centerY);
                ctx.rotate(angle);
                ctx.translate(-centerX, -centerY);
                break;
        }
    }

    updateParticleTargets() {
        const textPoints = this.textRenderer.getTextPoints(this.particleManager.targetParticleCount);
        this.particleManager.updateParticleTargets(textPoints);
    }

    start() {
        this.isPaused = false;
        requestAnimationFrame(this.animate.bind(this));
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.start();
        }
    }

    cleanup() {
        window.removeEventListener('resize', this.handleResize);
        const canvas = this.canvasManager.getCanvas();
        canvas.removeEventListener('mousemove', this.handlePointerMove);
        canvas.removeEventListener('touchmove', this.handlePointerMove);
        canvas.removeEventListener('mouseenter', () => this.isMouseInContainer = true);
        canvas.removeEventListener('mouseleave', () => this.isMouseInContainer = false);
        canvas.removeEventListener('touchstart', () => this.isMouseInContainer = true);
        canvas.removeEventListener('touchend', () => this.isMouseInContainer = false);

        this.particleManager.cleanup();
        this.textRenderer.cleanup();
        this.canvasManager.cleanup();
        this.uiManager.cleanup();
    }
}