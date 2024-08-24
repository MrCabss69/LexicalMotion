// text_renderer.js

class TextRenderer {
    constructor(canvasManager, configManager) {
        this.canvasManager = canvasManager;
        this.configManager = configManager;
        this.fontSize = this.configManager.getConfig('TEXT.FONT_SIZE');
        this.currentText = this.configManager.getConfig('TEXT.CONTENT');
        this.color = this.configManager.getConfig('TEXT.COLOR');
        this.lines = [];
        this.textBox = { width: 0, height: 0 };
        this.lastCalculatedDimensions = { width: 0, height: 0 };
        this.setupResizeListener();
    }

    setupResizeListener() {
        this.canvasManager.getCanvas().addEventListener('canvasResized', () => {
            this.recalculateTextProperties();
        });
    }

    recalculateTextProperties() {
        // Forzar el recálculo de las propiedades del texto
        this.lastCalculatedDimensions = { width: 0, height: 0 };
        this.calculateTextProperties();
    }
    
    calculateTextProperties() {
        const width = this.canvasManager.getWidth();
        const height = this.canvasManager.getHeight();

        if (width === this.lastCalculatedDimensions.width && 
            height === this.lastCalculatedDimensions.height) {
            return this.lastCalculatedResult;
        }

        const ctx = this.canvasManager.getContext();
        const maxWidth = width * 0.9;
        const maxHeight = height * 0.8;
        let fontSize = Math.min(width, height) / 10;

        const calculateDimensions = (size) => {
            ctx.font = `bold ${size}px Arial`;
            const words = this.currentText.split(' ');
            let lines = [];
            let currentLine = words[0];
            
            for (let i = 1; i < words.length; i++) {
                let testLine = currentLine + ' ' + words[i];
                let metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
            const textHeight = lines.length * size * 1.2;

            return { lines, textWidth, textHeight };
        };

        let { lines, textWidth, textHeight } = calculateDimensions(fontSize);
        
        while ((textWidth > maxWidth || textHeight > maxHeight) && fontSize > 10) {
            fontSize *= 0.9;
            ({ lines, textWidth, textHeight } = calculateDimensions(fontSize));
        }

        this.fontSize = fontSize;
        this.lines = lines;
        this.textBox = { width: textWidth, height: textHeight };

        const result = {
            fontSize: this.fontSize,
            lines: this.lines,
            x: width / 2,
            y: height / 2
        };

        this.lastCalculatedDimensions = { width, height };
        this.lastCalculatedResult = result;

        return result;
    }

    getTextPoints(targetParticleCount) {
        const { x, y } = this.calculateTextProperties();
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = Math.max(1, Math.ceil(this.textBox.width));
        tempCanvas.height = Math.max(1, Math.ceil(this.textBox.height));
        
        tempCtx.font = `bold ${this.fontSize}px Arial`;
        tempCtx.fillStyle = 'white';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        
        this.lines.forEach((line, index) => {
            tempCtx.fillText(line, tempCanvas.width / 2, (index + 0.5) * this.fontSize * 1.2);
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
                    y: y + py - tempCanvas.height / 2
                });
            }
        }

        return points;
    }

    drawGuideText() {
        const ctx = this.canvasManager.getContext();
        const { fontSize, lines, x, y } = this.calculateTextProperties();
        
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        lines.forEach((line, index) => {
            const lineY = y + (index - (lines.length - 1) / 2) * fontSize * 1.2;
            ctx.fillText(line, x, lineY);
        });
    }

    setText(text) {
        this.currentText = text;
        this.lastCalculatedDimensions = { width: 0, height: 0 }; // Force recalculation
    }

    setFontSize(size) {
        this.fontSize = size;
        this.lastCalculatedDimensions = { width: 0, height: 0 }; // Force recalculation
    }

    setColor(color) {
        this.color = color;
    }
}