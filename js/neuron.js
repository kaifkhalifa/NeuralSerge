class Neuron {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type; // normal, amplifier, inhibitor, gatekeeper
        this.radius = 15;
        this.isActive = false;
        this.connections = [];
        this.activationDelay = 200; // milliseconds
        this.pulseRadius = this.radius;
        this.maxPulseRadius = this.radius * 2;
        this.color = this.getColorByType();
    }

    getColorByType() {
        const colors = {
            normal: '#00ffff',
            amplifier: '#ff00ff',
            inhibitor: '#ff0000',
            gatekeeper: '#ffff00'
        };
        return colors[this.type] || colors.normal;
    }

    addConnection(neuron) {
        if (!this.connections.includes(neuron)) {
            this.connections.push(neuron);
        }
    }

    activate() {
        if (this.type === 'inhibitor' && this.isActive) {
            return false;
        }
        this.isActive = true;
        this.pulseRadius = this.radius;
        return true;
    }

    deactivate() {
        this.isActive = false;
        this.pulseRadius = this.radius;
    }

    update(deltaTime) {
        if (this.isActive) {
            this.pulseRadius += deltaTime * 0.1;
            if (this.pulseRadius > this.maxPulseRadius) {
                this.pulseRadius = this.radius;
            }
        }
    }

    draw(ctx) {
        // Draw pulse effect
        if (this.isActive) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw neuron body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isActive ? this.color : '#333';
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isClicked(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }
} 