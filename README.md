# LexicalMotion

LexiconInMotion is an interactive particle text animation project that transforms words into a mesmerizing dance of pixels. This project leverages the power of HTML5 Canvas, JavaScript, and creative coding techniques to create stunning visual representations of text through a complex system of animated particles.

![Example](demo.png)

## Features

- **Dynamic Text Rendering**: Convert any text input into a particle-based animation.
- **Interactive Particle System**: Particles react to mouse movements and text changes.
- **Customizable Appearance**: Adjust particle count, size, color, and behavior.
- **Responsive Design**: Adapts to different screen sizes and orientations.
- **Performance Optimized**: Efficient rendering for smooth animations even with high particle counts.
- **Multiple Animation Modes**: Choose from various text animation styles (e.g., pulse, rotate).


## Installation

1. Clone the repository:
   ```
   git clone https://github.com/MrCabss69/LexicalMotion.git
   ```
2. Navigate to the project directory:
   ```
   cd LexiconInMotion
   ```
3. Open `index.html` in your preferred web browser (tested w/ Live Server VS-Code).

## Usage

1. Open the application in a web browser.
2. Use the control panel on the right to adjust settings:
   - Enter text in the input field
   - Modify particle properties (count, size, color)
   - Adjust animation settings
3. Watch as your text comes to life with animated particles!
4. Interact with the animation using your mouse to see particles react.

## Configuration

You can customize various aspects of the animation through the `CONFIG` object in `index.js`:

```javascript
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
    },
    TEXT: {
        CONTENT: 'LexiconInMotion',
        FONT_SIZE: 100,
        COLOR: '#ffffff',
        ANIMATION: 'none'
    },
    BACKGROUND_COLOR: '#000000'
};
```

Adjust these values to see changes in the animation.

## Technologies Used

- HTML5 Canvas
- JavaScript (ES6+)
- CSS3

## Contributing

Contributions are always welcome! Feel free to submit a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request