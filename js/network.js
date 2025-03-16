class Network {
    constructor() {
        this.neurons = [];
        this.synapses = [];
        this.startNeuron = null;
        this.endNeuron = null;
    }

    addNeuron(x, y, type = 'normal') {
        const neuron = new Neuron(x, y, type);
        this.neurons.push(neuron);
        return neuron;
    }

    connectNeurons(sourceNeuron, targetNeuron) {
        const synapse = new Synapse(sourceNeuron, targetNeuron);
        this.synapses.push(synapse);
        sourceNeuron.addConnection(targetNeuron);
        return synapse;
    }

    setStartNeuron(neuron) {
        this.startNeuron = neuron;
    }

    setEndNeuron(neuron) {
        this.endNeuron = neuron;
    }

    getNeuronAt(x, y) {
        return this.neurons.find(neuron => neuron.isClicked(x, y));
    }

    activateNeuron(neuron) {
        if (neuron.activate()) {
            this.synapses
                .filter(synapse => synapse.source === neuron)
                .forEach(synapse => synapse.activate());
        }
    }

    update(deltaTime) {
        this.neurons.forEach(neuron => neuron.update(deltaTime));
        this.synapses.forEach(synapse => synapse.update(deltaTime));
    }

    draw(ctx) {
        // Draw synapses first
        this.synapses.forEach(synapse => synapse.draw(ctx));
        // Draw neurons on top
        this.neurons.forEach(neuron => neuron.draw(ctx));
    }

    generateLevel(level) {
        this.neurons = [];
        this.synapses = [];

        const width = window.innerWidth * 0.8;
        const height = window.innerHeight * 0.8;
        const numNeurons = 5 + level * 2;
        
        // Create start neuron
        this.startNeuron = this.addNeuron(100, height / 2, 'normal');
        
        // Create end neuron
        this.endNeuron = this.addNeuron(width - 100, height / 2, 'normal');

        // Generate random neurons
        for (let i = 0; i < numNeurons; i++) {
            const x = 200 + Math.random() * (width - 400);
            const y = 100 + Math.random() * (height - 200);
            const types = ['normal', 'amplifier', 'inhibitor', 'gatekeeper'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.addNeuron(x, y, type);
        }

        // Create random connections
        this.neurons.forEach(neuron => {
            const numConnections = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numConnections; i++) {
                const targetNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
                if (neuron !== targetNeuron) {
                    this.connectNeurons(neuron, targetNeuron);
                }
            }
        });

        // Ensure start and end neurons are connected to the network
        const firstRandomNeuron = this.neurons[2]; // Skip start and end neurons
        const lastRandomNeuron = this.neurons[this.neurons.length - 1];
        this.connectNeurons(this.startNeuron, firstRandomNeuron);
        this.connectNeurons(lastRandomNeuron, this.endNeuron);
    }
} 