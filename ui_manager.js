// UIManager.js
class UIManager {
    constructor(animationController) {
        this.animationController = animationController;
        this.configManager = animationController.configManager;
        this.controls = {};
        this.setupControls();
        this.setupControlsButton();
        this.adjustControlsLayout();
    }

    setupControlsButton() {
        this.toggleButton = document.getElementById('toggle-controls');
        if (!this.toggleButton) {
            this.toggleButton = this.createToggleButton();
        }
        this.toggleButton.onclick = () => this.toggleControlsVisibility();
        this.positionToggleButton();
    }

    positionToggleButton() {
        const buttonSize = 40;
        const margin = 10;
        Object.assign(this.toggleButton.style, {
            position: 'fixed',
            bottom: `${margin}px`,
            right: `${margin}px`,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            borderRadius: '50%',
            border: 'none',
            background: '#4CAF50',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: '1001'
        });
        this.toggleButton.innerHTML = '&#9776;';
    }

    toggleControlsVisibility() {
        const controls = document.getElementById('controls');
        const isHidden = controls.style.transform === 'translateY(100%)';
        controls.style.transform = isHidden ? 'translateY(0)' : 'translateY(100%)';
        this.toggleButton.innerHTML = isHidden ? '&#10005;' : '&#9776;';
    }

    adjustControlsLayout() {
        const controls = document.getElementById('controls');
        if (!controls) return;

        const rect = this.animationController.container.getBoundingClientRect();
        const isMobileView = rect.width < 768 || this.configManager.getConfig('IS_MOBILE');

        if (isMobileView) {
            this.setupMobileControls(controls);
        } else {
            this.setupDesktopControls(controls);
        }

        this.adjustControlStyles(controls, isMobileView);
    }

    setupMobileControls(controls) {
        Object.assign(controls.style, {
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            maxHeight: '40%',
            transform: 'translateY(100%)'
        });
        this.animationController.canvasManager.getCanvas().style.height = 'calc(100% - 50px)';
    }

    setupDesktopControls(controls) {
        Object.assign(controls.style, {
            position: 'absolute',
            top: '0',
            right: '0',
            width: '300px',
            height: '100%',
            transform: 'none'
        });
        this.animationController.canvasManager.getCanvas().style.height = '100%';
    }

    adjustControlStyles(controls, isMobileView) {
        Object.assign(controls.style, {
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            zIndex: '1000',
            padding: '10px',
            boxSizing: 'border-box',
            transition: 'transform 0.3s ease-in-out'
        });

        const fontSize = Math.max(12, Math.min(16, this.animationController.container.getBoundingClientRect().width / 50));
        controls.style.fontSize = `${fontSize}px`;

        const inputRanges = controls.querySelectorAll('input[type="range"]');
        inputRanges.forEach(range => {
            range.style.width = isMobileView ? '80%' : '100%';
        });
    }

    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-controls';
        toggleButton.textContent = 'Show Controls';
        this.animationController.container.appendChild(toggleButton);
        return toggleButton;
    }

    setupControls() {
        const controlIds = [
            'textInput', 'setTextButton', 'fontSize', 'textColor',
            'particleCount', 'particleDensity', 'particleMinSize', 'particleMaxSize',
            'particleColor', 'particleShape', 'transitionDuration', 'mouseRadius',
            'attractionForce', 'repulsionForce', 'friction', 'particleTrail',
            'particleGlow', 'textAnimation', 'backgroundColor', 'resetButton'
        ];

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
            this.controls.setTextButton.addEventListener('click', this.handleSetText.bind(this));
        }

        if (this.controls.resetButton) {
            this.controls.resetButton.addEventListener('click', this.resetAll.bind(this));
        }
    }

    handleSetText() {
        if (this.controls.textInput) {
            this.configManager.updateConfig('TEXT.CONTENT', this.controls.textInput.value);
            this.animationController.textRenderer.setText(this.configManager.getConfig('TEXT.CONTENT'));
            this.animationController.updateParticleTargets();
        }
    }

    handleControlChange(key, element) {
        if (!element) return;

        const value = this.getElementValue(element);
        this.configManager.updateConfig(this.getConfigKey(key), value);
        this.updateDisplayValue(key, value);
        this.applyControlChange(key, value);
    }

    getElementValue(element) {
        if (element.type === 'checkbox') return element.checked;
        if (element.type === 'range' || element.type === 'number') return parseFloat(element.value);
        return element.value;
    }

    getConfigKey(key) {
        const configMap = {
            'fontSize': 'TEXT.FONT_SIZE',
            'textColor': 'TEXT.COLOR',
            'particleCount': 'MAX_PARTICLES',
            'particleDensity': 'PARTICLE_DENSITY',
            'particleMinSize': 'PARTICLE.BASE_RADIUS.MIN',
            'particleMaxSize': 'PARTICLE.BASE_RADIUS.MAX',
            'particleColor': 'PARTICLE.COLOR',
            'particleShape': 'PARTICLE.SHAPE',
            'transitionDuration': 'TRANSITION_DURATION',
            'mouseRadius': 'MOUSE_EFFECT.RADIUS',
            'attractionForce': 'ANIMATION.ATTRACTION_FORCE',
            'repulsionForce': 'ANIMATION.REPULSION_FORCE',
            'friction': 'ANIMATION.FRICTION',
            'particleTrail': 'PARTICLE.TRAIL',
            'particleGlow': 'PARTICLE.GLOW',
            'textAnimation': 'TEXT.ANIMATION',
            'backgroundColor': 'BACKGROUND_COLOR'
        };
        return configMap[key] || key.toUpperCase();
    }

    updateDisplayValue(key, value) {
        const displayElement = document.getElementById(`${key}Value`);
        if (displayElement) {
            displayElement.textContent = typeof value === 'number' ? value.toFixed(2) : value;
        }
    }

    applyControlChange(key, value) {
        switch(key) {
            case 'fontSize':
                this.animationController.textRenderer.setFontSize(value);
                this.animationController.updateParticleTargets();
                break;
            case 'textColor':
                this.animationController.textRenderer.setColor(value);
                break;
            case 'particleCount':
                this.animationController.particleManager.targetParticleCount = value;
                this.animationController.updateParticleTargets();
                break;
            case 'particleDensity':
                this.animationController.updateParticleTargets();
                break;
            case 'particleMinSize':
            case 'particleMaxSize':
                this.animationController.particleManager.updateParticleSizes();
                break;
            case 'particleColor':
                this.animationController.particleManager.updateParticleColors();
                break;
            case 'particleShape':
                this.animationController.particleManager.updateParticleShapes();
                break;
            case 'backgroundColor':
                document.body.style.backgroundColor = value;
                break;
        }
    }

    resetAll() {
        this.configManager.resetToDefaults();
        this.updateControlValues();
        this.animationController.textRenderer.setText(this.configManager.getConfig('TEXT.CONTENT'));
        this.animationController.textRenderer.setFontSize(this.configManager.getConfig('TEXT.FONT_SIZE'));
        this.animationController.textRenderer.setColor(this.configManager.getConfig('TEXT.COLOR'));
        this.animationController.particleManager.initParticles();
        this.animationController.updateParticleTargets();
        document.body.style.backgroundColor = this.configManager.getConfig('BACKGROUND_COLOR');
    }

    updateControlValues() {
        for (let [key, element] of Object.entries(this.controls)) {
            if (!element) continue;
            
            const value = this.configManager.getConfig(this.getConfigKey(key));
            if (element.type === 'checkbox') {
                element.checked = value;
            } else {
                element.value = value;
            }
            this.updateDisplayValue(key, value);
        }
    }

    cleanup() {
        if (this.toggleButton && this.toggleButton.parentNode) {
            this.toggleButton.parentNode.removeChild(this.toggleButton);
        }

        for (let [key, element] of Object.entries(this.controls)) {
            if (element) {
                element.removeEventListener('input', () => this.handleControlChange(key, element));
            }
        }
        if (this.controls.setTextButton) {
            this.controls.setTextButton.removeEventListener('click', this.handleSetText);
        }
        if (this.controls.resetButton) {
            this.controls.resetButton.removeEventListener('click', this.resetAll);
        }
    }
}