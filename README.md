# 🌟 LexicalMotion: Particles Dance to Words 🌟

LexicalMotion is a visual tool that transforms input texts into dancing particles. This project fuses the power of Raw JS, HTML5 Canvas, and creative coding techniques to create stunning visual representations of text through a complex system of animated particles.

![Visual Demo](demo.png)


🚀 **Try it yourself!**: [https://mrcabss69.github.io/LexicalMotion/](https://mrcabss69.github.io/LexicalMotion/)

## ✨ Features You'll Love

- **Dynamic Text Rendering**: Turn any text input into a particle-based animation.
- **Interactive Particle System**: Particles react to mouse movements and text changes.
- **Customizable Appearance**: Adjust particle number, size, color, and behavior to your liking.
- **Responsive Design**: Adapts to different screen sizes and orientations.
- **Optimized for Performance**: Efficient rendering for smooth animations even with high particle counts.
- **Multiple Animation Modes**: Choose from various text animation styles (e.g. pulse, rotation).

## 🛠️ Installation

1. Clone the repository:
```
git clone https://github.com/MrCabss69/LexicalMotion.git
```
2. Navigate to the project directory:
```
cd LexicalMotion
```
3. Open `index.html` in your preferred web browser (tested with VS-Code's Live Server).

## 🎮 Usage

1. Open the application in a web browser.
2. Use the control panel on the right to adjust settings:
- Enter text in the input field
- Modify particle properties (amount, size, color)
- Adjust animation settings
3. Watch your text come to life with animated particles!
4. Interact with the animation using your mouse to see how the particles react.

## ⚙️ Configuration

You can customize various aspects of the animation via the `CONFIG` object in `config_manager.js`:

```javascript
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
    }
}
```


## 🚀 Technologies Used

- HTML5 Canvas: For high-performance graphic rendering
- JavaScript (RAW): For animation logic and particle manipulation
- CSS3: For styling and responsive design

## 🤝 Contributions

Contributions are always welcome! Feel free to submit a PR and be part of this exciting project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your changes (`git commit -m 'Add someAwesomeFeature'`)
4. Push to the branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

## 💡 Ideas for Future Improvements

- Implement new particle shapes (stars, hearts, etc.)
- Add reactive sound effects to the animation
- Create animation presets that users can select from
- Implement a save mode so users can save their favorite settings

---

Created with ❤️ by [MrCabss69](https://github.com/MrCabss69)

Did you like LexicalMotion? Don't forget to leave a ⭐️ in the repository!