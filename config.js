// config.js
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
