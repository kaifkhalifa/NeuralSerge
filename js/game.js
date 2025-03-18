class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.network = new Network();
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 30;
        this.isGameOver = false;
        this.lastTime = 0;
        this.isPaused = true; // Start paused for tutorial
        this.username = '';
        
        this.resizeCanvas();
        this.setupEventListeners();
        this.showTutorial(); // Show tutorial on start
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    showTutorial() {
        const tutorial = document.getElementById('tutorial');
        tutorial.classList.add('show');
        this.isPaused = true;
        
        // Set default username from localStorage if it exists
        const savedUsername = localStorage.getItem('neuralNetworkUsername');
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
        }
    }

    hideTutorial() {
        const tutorial = document.getElementById('tutorial');
        tutorial.classList.remove('show');
        this.isPaused = false;
        
        // Save username
        this.username = document.getElementById('username').value.trim() || 'Player';
        localStorage.setItem('neuralNetworkUsername', this.username);
        
        if (this.lastTime === 0) {
            this.startGame();
        }
    }

    showGameOver() {
        const gameOver = document.getElementById('gameOver');
        document.getElementById('finalScore').textContent = this.score;
        
        // Save score to leaderboard
        this.saveScore();
        
        // Display leaderboard
        this.displayLeaderboard();
        
        gameOver.classList.add('show');
    }

    hideGameOver() {
        const gameOver = document.getElementById('gameOver');
        gameOver.classList.remove('show');
        this.startGame();
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('neuralNetworkScores') || '[]');
        scores.push({
            username: this.username,
            score: this.score,
            date: new Date().toISOString()
        });
        
        // Sort scores and keep only top 10
        scores.sort((a, b) => b.score - a.score);
        scores.splice(10);
        
        localStorage.setItem('neuralNetworkScores', JSON.stringify(scores));
    }

    displayLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('neuralNetworkScores') || '[]');
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';
        
        scores.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            if (entry.username === this.username && entry.score === this.score) {
                div.classList.add('highlight');
            }
            
            div.innerHTML = `
                <span>#${index + 1} ${entry.username}</span>
                <span>${entry.score}</span>
            `;
            leaderboardList.appendChild(div);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Tutorial controls
        document.getElementById('startButton').addEventListener('click', () => this.hideTutorial());
        document.getElementById('helpButton').addEventListener('click', () => this.showTutorial());
        document.getElementById('playAgainButton').addEventListener('click', () => this.hideGameOver());
        
        this.canvas.addEventListener('click', (event) => {
            if (this.isGameOver || this.isPaused) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const clickedNeuron = this.network.getNeuronAt(x, y);
            if (clickedNeuron) {
                const activated = this.network.activateNeuron(clickedNeuron);
                
                // Only proceed to next level if end neuron was properly activated through a connection
                if (activated && clickedNeuron === this.network.endNeuron && this.network.endNeuronActivatedProperly) {
                    this.score += Math.ceil(this.timeRemaining * 10);
                    this.nextLevel();
                }
            }
        });
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 30;
        this.isGameOver = false;
        this.network.generateLevel(this.level);
        this.updateHUD();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    nextLevel() {
        this.level++;
        this.timeRemaining = 30;
        
        // Play level up sound
        if (typeof soundManager !== 'undefined') {
            soundManager.play('levelUp');
        }
        
        this.network.generateLevel(this.level);
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('timer').textContent = Math.ceil(this.timeRemaining);
    }

    gameLoop(currentTime) {
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (!this.isGameOver && !this.isPaused) {
            // Update timer
            this.timeRemaining -= deltaTime / 1000;
            if (this.timeRemaining <= 0) {
                this.isGameOver = true;
                this.showGameOver();
                return;
            }

            // Clear canvas
            this.ctx.fillStyle = '#0a0a1a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Update and draw network
            this.network.update(deltaTime);
            this.network.draw(this.ctx);

            // Update HUD
            this.updateHUD();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 