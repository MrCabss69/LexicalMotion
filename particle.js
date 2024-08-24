// particle.js 

class Particle {
    constructor(x, y, configManager) {
        if (!configManager) {
            throw new Error('ConfigManager is required for Particle initialization');
        }
        this.configManager = configManager;
        this.x = this.targetX = x;
        this.y = this.targetY = y;
        const initialVelocity = this.configManager.getConfig('PARTICLE.INITIAL_VELOCITY');
        this.vx = Utils.random(-initialVelocity, initialVelocity);
        this.vy = Utils.random(-initialVelocity, initialVelocity);
        this.radius = Utils.random(
            this.configManager.getConfig('PARTICLE.BASE_RADIUS.MIN'),
            this.configManager.getConfig('PARTICLE.BASE_RADIUS.MAX')
        );
        this.color = this.configManager.getConfig('PARTICLE.COLOR');
        this.shape = this.configManager.getConfig('PARTICLE.SHAPE');
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update(width, height, mouseX, mouseY, isMouseInContainer) {
        // Mover hacia el objetivo
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distanceToTarget = Math.hypot(dx, dy);
        const attractionForce = this.configManager.getConfig('ANIMATION.ATTRACTION_FORCE') * (distanceToTarget / 100);
        this.vx += (dx / distanceToTarget) * attractionForce;
        this.vy += (dy / distanceToTarget) * attractionForce;

        // Interacción con el ratón (solo si el ratón está dentro del canvas)
        if (isMouseInContainer) {
            const dxMouse = mouseX - this.x;
            const dyMouse = mouseY - this.y;
            const distanceToMouse = Math.hypot(dxMouse, dyMouse);
            if (distanceToMouse < this.configManager.getConfig('MOUSE_EFFECT.RADIUS')) {
                const repulsionForce = this.configManager.getConfig('ANIMATION.REPULSION_FORCE') * (1 - distanceToMouse / this.configManager.getConfig('MOUSE_EFFECT.RADIUS'));
                this.vx -= (dxMouse / distanceToMouse) * repulsionForce;
                this.vy -= (dyMouse / distanceToMouse) * repulsionForce;
            }
        }

        // Actualizar posición
        this.x += this.vx;
        this.y += this.vy;

        // Límites del canvas
        this.x = Utils.clamp(this.x, this.radius, width - this.radius);
        this.y = Utils.clamp(this.y, this.radius, height - this.radius);

        // Fricción
        this.vx *= this.configManager.getConfig('ANIMATION.FRICTION');
        this.vy *= this.configManager.getConfig('ANIMATION.FRICTION');
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        if (this.configManager.getConfig('PARTICLE.GLOW')) {
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

        if (this.configManager.getConfig('CONFIG.PARTICLE.TRAIL')){
            // Implementar lógica para el trail si es necesario
        }

        ctx.shadowBlur = 0;
    }
}