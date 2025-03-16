class Synapse {
    constructor(sourceNeuron, targetNeuron) {
        this.source = sourceNeuron;
        this.target = targetNeuron;
        this.isActive = false;
        this.signalPosition = 0; // 0 to 1, represents signal position along the synapse
        this.signalSpeed = 0.005; // Speed of signal propagation
        this.width = 2;
        this.color = '#00ffff';
    }

    activate() {
        this.isActive = true;
        this.signalPosition = 0;
    }

    deactivate() {
        this.isActive = false;
        this.signalPosition = 0;
    }

    update(deltaTime) {
        if (this.isActive) {
            this.signalPosition += this.signalSpeed * deltaTime;
            if (this.signalPosition >= 1) {
                this.target.activate();
                this.deactivate();
            }
        }
    }

    draw(ctx) {
        // Draw base line
        ctx.beginPath();
        ctx.moveTo(this.source.x, this.source.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = this.width;
        ctx.stroke();

        // Draw active signal
        if (this.isActive) {
            const startX = this.source.x + (this.target.x - this.source.x) * (this.signalPosition - 0.1);
            const startY = this.source.y + (this.target.y - this.source.y) * (this.signalPosition - 0.1);
            const endX = this.source.x + (this.target.x - this.source.x) * (this.signalPosition + 0.1);
            const endY = this.source.y + (this.target.y - this.source.y) * (this.signalPosition + 0.1);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width * 2;
            ctx.stroke();
        }
    }
} 