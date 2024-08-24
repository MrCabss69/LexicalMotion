document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const animationController = new AnimationController(container);
    animationController.start();
});
