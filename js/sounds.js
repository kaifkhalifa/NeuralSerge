// Sound effects manager for Neural Network game
class SoundManager {
    constructor() {
        // Initialize sound effects
        this.sounds = {
            // NEURON CLICK SOUND OPTIONS - uncomment the one you prefer:
            
            // Option 1: Game-like click (default)
            neuronClick: new Audio('sounds/neuron-click-game.mp3'),
            
            // Option 2: Lighter pleasant click
            // neuronClick: new Audio('sounds/neuron-click-pleasant.mp3'),
            
            // Option 3: Musical tone
            // neuronClick: new Audio('sounds/neuron-click-new.mp3'),
            
            // Other game sounds
            levelUp: new Audio('sounds/level-up.mp3')
        };
        
        // Set default properties
        for (const sound in this.sounds) {
            this.sounds[sound].volume = 0.6;
        }
        
        // Fine-tune specific sounds
        this.sounds.neuronClick.volume = 0.4; // Lower volume for click sound
    }
    
    // Play a sound from the collection
    play(soundName) {
        if (this.sounds[soundName]) {
            // Clone the audio to allow overlapping sounds
            const sound = this.sounds[soundName].cloneNode();
            sound.play().catch(e => console.log('Error playing sound:', e));
        }
    }
}

// Create a global sound manager instance
const soundManager = new SoundManager(); 