// Configuration
const CONFIG = {
    MAX_PARTICLES: 5000,
    PARTICLE_DENSITY: 1/7,
    TRANSITION_DURATION: 3000,
    MOUSE_EFFECT: { RADIUS: 30 },
    ANIMATION: {
        ATTRACTION_FORCE: 0.05,
        REPULSION_FORCE: 0.2,
        FRICTION: 0.97,
    },
    PARTICLE: {
        BASE_RADIUS: { MIN: 1, MAX: 2.5 },
        INITIAL_VELOCITY: 0.5,
        COLOR: '#ff0000',
        SHAPE: 'circle',
        TRAIL: false,
        GLOW: false
    },
    TEXT: {
        CONTENT: 'CENSORSHIP IS NOT FREEDOM',
        FONT_SIZE: 100,
        COLOR: '#ffffff',
        ANIMATION: 'none'
    },
    BACKGROUND_COLOR: '#000000'
};

// Utility functions
const Utils = {
    random: (min, max) => Math.random() * (max - min) + min,
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
    lerp: (start, end, t) => start * (1 - t) + end * t
};

class Particle {
    constructor(x, y) {
        this.x = this.targetX = x;
        this.y = this.targetY = y;
        this.vx = Utils.random(-CONFIG.PARTICLE.INITIAL_VELOCITY, CONFIG.PARTICLE.INITIAL_VELOCITY);
        this.vy = Utils.random(-CONFIG.PARTICLE.INITIAL_VELOCITY, CONFIG.PARTICLE.INITIAL_VELOCITY);
        this.radius = Utils.random(CONFIG.PARTICLE.BASE_RADIUS.MIN, CONFIG.PARTICLE.BASE_RADIUS.MAX);
        this.color = CONFIG.PARTICLE.COLOR;
        this.shape = CONFIG.PARTICLE.SHAPE;
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update(width, height, mouseX, mouseY, isMouseInContainer) {
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distanceToTarget = Math.hypot(dx, dy);
        const attractionForce = CONFIG.ANIMATION.ATTRACTION_FORCE * (distanceToTarget / 100);
        this.vx += (dx / distanceToTarget) * attractionForce;
        this.vy += (dy / distanceToTarget) * attractionForce;

        // Mouse interaction
        if (isMouseInContainer) {
            const dxMouse = mouseX - this.x;
            const dyMouse = mouseY - this.y;
            const distanceToMouse = Math.hypot(dxMouse, dyMouse);
            if (distanceToMouse < CONFIG.MOUSE_EFFECT.RADIUS) {
                const repulsionForce = CONFIG.ANIMATION.REPULSION_FORCE / Math.max(1, distanceToMouse);
                this.vx -= (dxMouse / distanceToMouse) * repulsionForce;
                this.vy -= (dyMouse / distanceToMouse) * repulsionForce;
            }
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Canvas boundaries
        this.x = Utils.clamp(this.x, this.radius, width - this.radius);
        this.y = Utils.clamp(this.y, this.radius, height - this.radius);
        if (this.x <= this.radius || this.x >= width - this.radius) this.vx *= -1;
        if (this.y <= this.radius || this.y >= height - this.radius) this.vy *= -1;

        // Friction
        this.vx *= CONFIG.ANIMATION.FRICTION;
        this.vy *= CONFIG.ANIMATION.FRICTION;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        if (CONFIG.PARTICLE.GLOW) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
        }
        
        switch (this.shape) {
            case 'square':
                ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.radius);
                ctx.lineTo(this.x - this.radius, this.y + this.radius);
                ctx.lineTo(this.x + this.radius, this.y + this.radius);
                ctx.closePath();
                ctx.fill();
                break;
            default: // circle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
        }

        if (CONFIG.PARTICLE.TRAIL) {
            // Implementar lógica para el trail si es necesario
        }

        ctx.shadowBlur = 0;
    }
}


class TextRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.fontSize = CONFIG.TEXT.FONT_SIZE;
        this.currentText = CONFIG.TEXT.CONTENT;
        this.color = CONFIG.TEXT.COLOR;
        this.lines = [];
        this.maxWidth = 0;
        this.lineHeight = 0;
        this.textBox = { width: 0, height: 0 };
    }

    calculateTextProperties(canvasWidth, canvasHeight) {
        this.ctx.font = `bold ${this.fontSize}px Arial`;
        this.lineHeight = this.fontSize * 1.2;
        this.lines = [];
        this.maxWidth = canvasWidth * 0.9;

        let words = this.currentText.split(' ');
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            let metrics = this.ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > this.maxWidth) {
                this.lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        this.lines.push(currentLine);

        // Ajustar el tamaño de la fuente si el texto es demasiado grande
        let totalTextHeight = this.lines.length * this.lineHeight;
        if (totalTextHeight > canvasHeight * 0.8) {
            let scaleFactor = (canvasHeight * 0.8) / totalTextHeight;
            this.fontSize *= scaleFactor;
            this.lineHeight *= scaleFactor;
            this.ctx.font = `bold ${this.fontSize}px Arial`;
        }

        this.textBox.width = this.maxWidth;
        this.textBox.height = this.lines.length * this.lineHeight;

        return {
            fontSize: this.fontSize,
            lineHeight: this.lineHeight,
            lines: this.lines,
            x: canvasWidth / 2,
            y: (canvasHeight - this.textBox.height) / 2
        };
    }

    getTextPoints(canvasWidth, canvasHeight, targetParticleCount) {
        const { x, y } = this.calculateTextProperties(canvasWidth, canvasHeight);
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.textBox.width;
        tempCanvas.height = this.textBox.height;
        
        tempCtx.font = `bold ${this.fontSize}px Arial`;
        tempCtx.fillStyle = 'white';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        
        this.lines.forEach((line, index) => {
            tempCtx.fillText(line, tempCanvas.width / 2, (index + 0.5) * this.lineHeight);
        });

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const points = [];
        const samplingFactor = Math.max(1, Math.ceil(imageData.data.length / 4 / targetParticleCount));

        for (let i = 0; i < imageData.data.length; i += samplingFactor * 4) {
            if (imageData.data[i + 3] > 128) {
                const px = (i / 4) % tempCanvas.width;
                const py = Math.floor((i / 4) / tempCanvas.width);
                points.push({
                    x: x + px - tempCanvas.width / 2,
                    y: y + py
                });
            }
        }

        return points;
    }

    drawGuideText(canvasWidth, canvasHeight) {
        const { fontSize, lineHeight, lines, x, y } = this.calculateTextProperties(canvasWidth, canvasHeight);
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        lines.forEach((line, index) => {
            this.ctx.fillText(line, x, y + index * lineHeight);
        });
    }

    setText(text) {
        this.currentText = text;
    }

    setFontSize(size) {
        this.fontSize = size;
    }

    setColor(color) {
        this.color = color;
    }
}

class ParticleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.particles = [];
        this.targetParticleCount = CONFIG.MAX_PARTICLES;
    }

    initParticles() {
        this.particles = Array.from({ length: this.targetParticleCount }, () => 
            new Particle(Utils.random(0, this.canvas.width), Utils.random(0, this.canvas.height))
        );
    }

    updateParticles(mouseX, mouseY, isMouseInContainer) {
        for (let particle of this.particles) {
            particle.update(this.canvas.width, this.canvas.height, mouseX, mouseY, isMouseInContainer);
        }
    }

    drawParticles(ctx) {
        for (let particle of this.particles) {
            particle.draw(ctx);
        }
    }

    updateParticleTargets(textPoints) {
        const particleCount = Math.min(this.particles.length, textPoints.length);
        const assignedTargets = new Set();
    
        // Asignar partículas existentes a los puntos más cercanos
        for (let i = 0; i < particleCount; i++) {
            let closestTargetIndex = -1;
            let minDistance = Infinity;
    
            for (let j = 0; j < textPoints.length; j++) {
                if (assignedTargets.has(j)) continue;
    
                const dx = this.particles[i].x - textPoints[j].x;
                const dy = this.particles[i].y - textPoints[j].y;
                const distance = dx * dx + dy * dy;
    
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTargetIndex = j;
                }
            }
    
            if (closestTargetIndex !== -1) {
                this.particles[i].setTarget(textPoints[closestTargetIndex].x, textPoints[closestTargetIndex].y);
                assignedTargets.add(closestTargetIndex);
            }
        }
    
        // Ajustar el número de partículas si es necesario
        if (this.particles.length > textPoints.length) {
            this.particles.splice(textPoints.length);
        } else if (this.particles.length < textPoints.length) {
            for (let i = this.particles.length; i < textPoints.length; i++) {
                const newParticle = new Particle(
                    Utils.random(0, this.canvas.width),
                    Utils.random(0, this.canvas.height)
                );
                newParticle.setTarget(textPoints[i].x, textPoints[i].y);
                this.particles.push(newParticle);
            }
        }
    }

    updateParticleSizes() {
        for (let particle of this.particles) {
            particle.radius = Utils.random(CONFIG.PARTICLE.BASE_RADIUS.MIN, CONFIG.PARTICLE.BASE_RADIUS.MAX);
        }
    }

    updateParticleColors() {
        for (let particle of this.particles) {
            particle.color = CONFIG.PARTICLE.COLOR;
        }
    }

    updateParticleShapes() {
        for (let particle of this.particles) {
            particle.shape = CONFIG.PARTICLE.SHAPE;
        }
    }
}

class AnimationController {
    constructor(container, canvas, ctx) {
        this.container = container;
        this.canvas = canvas;
        this.ctx = ctx;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseInContainer = false;

        this.textRenderer = new TextRenderer(ctx);
        this.particleManager = new ParticleManager(canvas);

        this.setupEventListeners();
        this.resizeCanvas();
        this.particleManager.initParticles();
        this.updateParticleTargets();
        this.setupControls();
    }

    setupControls() {
        const controlIds = [
            'textInput', 'setTextButton', 'fontSize', 'textColor',
            'particleCount', 'particleDensity', 'particleMinSize', 'particleMaxSize',
            'particleColor', 'particleShape', 'transitionDuration', 'mouseRadius',
            'attractionForce', 'repulsionForce', 'friction', 'particleTrail',
            'particleGlow', 'textAnimation', 'backgroundColor', 'resetButton'
        ];

        this.controls = {};

        for (let id of controlIds) {
            const element = document.getElementById(id);
            if (element) {
                this.controls[id] = element;
                if (id !== 'setTextButton' && id !== 'resetButton') {
                    element.addEventListener('input', () => this.handleControlChange(id, element));
                }
            } else {
                console.warn(`Control element with id "${id}" not found.`);
            }
        }

        if (this.controls.setTextButton) {
            this.controls.setTextButton.addEventListener('click', () => {
                if (this.controls.textInput) {
                    CONFIG.TEXT.CONTENT = this.controls.textInput.value;
                    this.textRenderer.setText(CONFIG.TEXT.CONTENT);
                    this.updateParticleTargets();
                }
            });
        }

        if (this.controls.resetButton) {
            this.controls.resetButton.addEventListener('click', () => this.resetAll());
        }
    }

    handleControlChange(key, element) {
        if (!element) return;

        const value = element.type === 'checkbox' ? element.checked :
                      element.type === 'range' || element.type === 'number' ? parseFloat(element.value) :
                      element.value;

        switch(key) {
            case 'fontSize':
                CONFIG.TEXT.FONT_SIZE = value;
                this.textRenderer.setFontSize(value);
                this.updateParticleTargets();
                break;
            case 'textColor':
                CONFIG.TEXT.COLOR = value;
                this.textRenderer.setColor(value);
                break;
            case 'particleCount':
                CONFIG.MAX_PARTICLES = value;
                this.particleManager.targetParticleCount = value;
                this.updateParticleTargets();
                break;
            case 'particleDensity':
                CONFIG.PARTICLE_DENSITY = value;
                this.updateParticleTargets();
                break;
            case 'particleMinSize':
                CONFIG.PARTICLE.BASE_RADIUS.MIN = value;
                this.particleManager.updateParticleSizes();
                break;
            case 'particleMaxSize':
                CONFIG.PARTICLE.BASE_RADIUS.MAX = value;
                this.particleManager.updateParticleSizes();
                break;
            case 'particleColor':
                CONFIG.PARTICLE.COLOR = value;
                this.particleManager.updateParticleColors();
                break;
            case 'particleShape':
                CONFIG.PARTICLE.SHAPE = value;
                this.particleManager.updateParticleShapes();
                break;
            case 'transitionDuration':
                CONFIG.TRANSITION_DURATION = value;
                break;
            case 'mouseRadius':
                CONFIG.MOUSE_EFFECT.RADIUS = value;
                break;
            case 'attractionForce':
                CONFIG.ANIMATION.ATTRACTION_FORCE = value;
                break;
            case 'repulsionForce':
                CONFIG.ANIMATION.REPULSION_FORCE = value;
                break;
            case 'friction':
                CONFIG.ANIMATION.FRICTION = value;
                break;
            case 'particleTrail':
                CONFIG.PARTICLE.TRAIL = value;
                break;
            case 'particleGlow':
                CONFIG.PARTICLE.GLOW = value;
                break;
            case 'textAnimation':
                CONFIG.TEXT.ANIMATION = value;
                break;
            case 'backgroundColor':
                CONFIG.BACKGROUND_COLOR = value;
                document.body.style.backgroundColor = value;
                break;
        }
        this.updateDisplayValue(key, value);
    }

    updateControlValues() {
        for (let [key, element] of Object.entries(this.controls)) {
            if (!element) continue;
            
            switch(key) {
                case 'textInput':
                    element.value = CONFIG.TEXT.CONTENT;
                    break;
                case 'fontSize':
                    element.value = CONFIG.TEXT.FONT_SIZE;
                    this.updateDisplayValue(key, CONFIG.TEXT.FONT_SIZE);
                    break;
                case 'textColor':
                    element.value = CONFIG.TEXT.COLOR;
                    break;
                case 'particleCount':
                    element.value = CONFIG.MAX_PARTICLES;
                    this.updateDisplayValue(key, CONFIG.MAX_PARTICLES);
                    break;
                case 'particleDensity':
                    element.value = CONFIG.PARTICLE_DENSITY;
                    this.updateDisplayValue(key, CONFIG.PARTICLE_DENSITY);
                    break;
                case 'particleMinSize':
                    element.value = CONFIG.PARTICLE.BASE_RADIUS.MIN;
                    this.updateDisplayValue(key, CONFIG.PARTICLE.BASE_RADIUS.MIN);
                    break;
                case 'particleMaxSize':
                    element.value = CONFIG.PARTICLE.BASE_RADIUS.MAX;
                    this.updateDisplayValue(key, CONFIG.PARTICLE.BASE_RADIUS.MAX);
                    break;
                case 'particleColor':
                    element.value = CONFIG.PARTICLE.COLOR;
                    break;
                case 'particleShape':
                    element.value = CONFIG.PARTICLE.SHAPE;
                    break;
                case 'transitionDuration':
                    element.value = CONFIG.TRANSITION_DURATION;
                    this.updateDisplayValue(key, CONFIG.TRANSITION_DURATION);
                    break;
                case 'mouseRadius':
                    element.value = CONFIG.MOUSE_EFFECT.RADIUS;
                    this.updateDisplayValue(key, CONFIG.MOUSE_EFFECT.RADIUS);
                    break;
                case 'attractionForce':
                    element.value = CONFIG.ANIMATION.ATTRACTION_FORCE;
                    this.updateDisplayValue(key, CONFIG.ANIMATION.ATTRACTION_FORCE);
                    break;
                case 'repulsionForce':
                    element.value = CONFIG.ANIMATION.REPULSION_FORCE;
                    this.updateDisplayValue(key, CONFIG.ANIMATION.REPULSION_FORCE);
                    break;
                case 'friction':
                    element.value = CONFIG.ANIMATION.FRICTION;
                    this.updateDisplayValue(key, CONFIG.ANIMATION.FRICTION);
                    break;
                case 'particleTrail':
                    element.checked = CONFIG.PARTICLE.TRAIL;
                    break;
                case 'particleGlow':
                    element.checked = CONFIG.PARTICLE.GLOW;
                    break;
                case 'textAnimation':
                    element.value = CONFIG.TEXT.ANIMATION;
                    break;
                case 'backgroundColor':
                    element.value = CONFIG.BACKGROUND_COLOR;
                    document.body.style.backgroundColor = CONFIG.BACKGROUND_COLOR;
                    break;
            }
        }
    }

    updateDisplayValue(key, value) {
        const displayElement = document.getElementById(`${key}Value`);
        if (displayElement) {
            displayElement.textContent = typeof value === 'number' ? value.toFixed(2) : value;
        }
    }

    resetAll() {
        // Reset CONFIG to default values
        Object.assign(CONFIG, {
            MAX_PARTICLES: 5000,
            PARTICLE_DENSITY: 1/7,
            TRANSITION_DURATION: 3000,
            MOUSE_EFFECT: { RADIUS: 30 },
            ANIMATION: {
                ATTRACTION_FORCE: 0.05,
                REPULSION_FORCE: 0.2,
                FRICTION: 0.97,
            },
            PARTICLE: {
                BASE_RADIUS: { MIN: 1, MAX: 2.5 },
                INITIAL_VELOCITY: 0.5,
                COLOR: '#ff0000',
                SHAPE: 'circle',
                TRAIL: false,
                GLOW: false
            },
            TEXT: {
                CONTENT: 'CENSORSHIP IS NOT FREEDOM',
                FONT_SIZE: 100,
                COLOR: '#ffffff',
                ANIMATION: 'none'
            },
            BACKGROUND_COLOR: '#000000'
        });

        this.updateControlValues();
        this.textRenderer.setText(CONFIG.TEXT.CONTENT);
        this.textRenderer.setFontSize(CONFIG.TEXT.FONT_SIZE);
        this.textRenderer.setColor(CONFIG.TEXT.COLOR);
        this.particleManager.resetParticles();
        this.updateParticleTargets();
        document.body.style.backgroundColor = CONFIG.BACKGROUND_COLOR;
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseenter', () => this.isMouseInContainer = true);
        this.canvas.addEventListener('mouseleave', () => this.isMouseInContainer = false);
    }

    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.updateParticleTargets();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    updateParticleTargets() {
        const textPoints = this.textRenderer.getTextPoints(this.canvas.width, this.canvas.height, this.particleManager.targetParticleCount);
        this.particleManager.updateParticleTargets(textPoints);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Restablecer la transformación antes de dibujar
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Aplicar animación de texto si está activa
        if (CONFIG.TEXT.ANIMATION !== 'none') {
            this.applyTextAnimation();
        }
        
        this.textRenderer.drawGuideText(this.canvas.width, this.canvas.height);
        this.particleManager.updateParticles(this.mouseX, this.mouseY, this.isMouseInContainer);
        this.particleManager.drawParticles(this.ctx);

        requestAnimationFrame(this.animate.bind(this));
    }

    applyTextAnimation() {
        const time = Date.now();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        switch(CONFIG.TEXT.ANIMATION) {
            case 'pulse':
                const scale = 1 + 0.05 * Math.sin(time / 500);
                this.ctx.setTransform(scale, 0, 0, scale, centerX * (1 - scale), centerY * (1 - scale));
                break;
            case 'rotate':
                const angle = Math.sin(time / 1000) * Math.PI / 32;
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(angle);
                this.ctx.translate(-centerX, -centerY);
                break;
        }
    }

    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Main script
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    
    const canvas = document.createElement('canvas');
    // Set the canvas dimensions to match the container's dimensions
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Append the canvas to the container
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    container.appendChild(canvas);
    new AnimationController(container, canvas, ctx).start();
});