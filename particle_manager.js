// particle_manager.js

class ParticleManager {
    constructor(canvasManager, configManager) {
        this.canvasManager = canvasManager;
        this.configManager = configManager;
        this.particles = [];
        this.targetParticleCount = this.configManager.getConfig('MAX_PARTICLES');
        this.setupResizeListener();
    }

    initParticles() {
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();
        this.particles = Array.from({ length: this.targetParticleCount }, () => 
            new Particle(Utils.random(0, width), Utils.random(0, height), this.configManager)
        );
    }

    setupResizeListener() {
        this.canvasManager.getCanvas().addEventListener('canvasResized', (event) => {
            this.adjustParticlesOnResize(event.detail);
        });
    }

    adjustParticlesOnResize(resizeDetail) {
        const { oldWidth, oldHeight, newWidth, newHeight } = resizeDetail;
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;
        
        this.particles.forEach(particle => {
            particle.x *= scaleX;
            particle.y *= scaleY;
            particle.targetX *= scaleX;
            particle.targetY *= scaleY;
        });

        // Asegurarse de que las partículas estén dentro de los nuevos límites
        this.particles.forEach(particle => {
            particle.x = Utils.clamp(particle.x, particle.radius, newWidth - particle.radius);
            particle.y = Utils.clamp(particle.y, particle.radius, newHeight - particle.radius);
        });
    }

    containParticle(particle) {
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();
        const margin = particle.radius;
        particle.x = Math.max(margin, Math.min(width - margin, particle.x));
        particle.y = Math.max(margin, Math.min(height - margin, particle.y));
    }

    updateAndDrawParticles(mouseX, mouseY, isMouseInContainer) {
        const ctx = this.canvasManager.getContext();
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();

        ctx.clearRect(0, 0, width, height);

        this.particles.forEach(particle => {
            particle.update(width, height, mouseX, mouseY, isMouseInContainer);
            particle.draw(ctx);
        });
    }

    updateParticleTargets(textPoints) {
        const particleCount = Math.min(this.particles.length, textPoints.length);
        const assignedTargets = new Set();
    
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
    
        this.adjustParticleCount(textPoints);
    }

    adjustParticleCount(textPoints) {
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();

        if (this.particles.length > textPoints.length) {
            this.particles.splice(textPoints.length);
        } else if (this.particles.length < textPoints.length) {
            for (let i = this.particles.length; i < textPoints.length; i++) {
                const newParticle = new Particle(
                    Utils.random(0, width),
                    Utils.random(0, height),
                    this.configManager
                );
                newParticle.setTarget(textPoints[i].x, textPoints[i].y);
                this.particles.push(newParticle);
            }
        }
    }

    updateParticleSizes() {
        const minRadius = this.configManager.getConfig('PARTICLE.BASE_RADIUS.MIN');
        const maxRadius = this.configManager.getConfig('PARTICLE.BASE_RADIUS.MAX');
        this.particles.forEach(particle => {
            particle.radius = Utils.random(minRadius, maxRadius);
        });
    }

    updateParticleColors() {
        const color = this.configManager.getConfig('PARTICLE.COLOR');
        this.particles.forEach(particle => {
            particle.color = color;
        });
    }

    updateParticleShapes() {
        const shape = this.configManager.getConfig('PARTICLE.SHAPE');
        this.particles.forEach(particle => {
            particle.shape = shape;
        });
    }
}