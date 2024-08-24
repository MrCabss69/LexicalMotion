// Utility functions
const Utils = {
    random: (min, max) => Math.random() * (max - min) + min,
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
    lerp: (start, end, t) => start * (1 - t) + end * t,
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
