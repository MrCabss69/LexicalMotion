class ConfigManager {
    constructor() {
        this.config = this.getDefaultConfig();
        this.adjustConfigForMobile();
    }

    getDefaultConfig() {
        return {
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
            BACKGROUND_COLOR: '#000000',
            IS_MOBILE: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
    }

    adjustConfigForMobile() {
        if (this.config.IS_MOBILE) {
            this.config.MAX_PARTICLES = Math.min(this.config.MAX_PARTICLES, 2000);
            this.config.PARTICLE.BASE_RADIUS.MIN = Math.max(this.config.PARTICLE.BASE_RADIUS.MIN, 2);
            this.config.PARTICLE.BASE_RADIUS.MAX = Math.max(this.config.PARTICLE.BASE_RADIUS.MAX, 4);
        }
    }

    getConfig(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.config);
    }

    updateConfig(key, value) {
        const keys = key.split('.');
        const lastKey = keys.pop();
        const obj = keys.reduce((o, k) => o[k] = o[k] || {}, this.config);
        obj[lastKey] = value;
    }

    resetToDefaults() {
        this.config = this.getDefaultConfig();
        this.adjustConfigForMobile();
    }
}