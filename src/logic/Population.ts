import Individual from "./Individual.ts";


export default class Population {
    size = 10;
    target: string;
    mutationRate = 0.1;
    population: Individual[] = [];
    averageFitness: number;
    generationCount: number;
    _onUpdate: CallableFunction;

    constructor(size: number, target: string, mutationRate: number) {
        this.size = size;
        this.target = target;
        this.mutationRate = mutationRate;
        this.population = [];
        this.averageFitness = 0;
        this.generationCount = 1;
        this._onUpdate = () => { };

        for (let i = 0; i < this.size; i++) {
            this.population.push(new Individual("", this.generationCount, target.length, this.mutationRate, target));
        };
        this.bestFitness();
    };

    bestFitness() {
        this.population = this.population.sort((a, b) => a.fitness - b.fitness);
    };

    calculateAverageFitness() {
        let averageFitness = 0;
        for (let i = 0; i < this.size; i++) {
            averageFitness += this.population[i].fitness;
        };
        averageFitness /= this.size;
        return averageFitness;
    };

    updateTarget(target:string) {
        this.target = target;
    };

    nextGen() {
        const nextPopulation: Individual[] = [];
        this.generationCount++;
        nextPopulation[0] = this.population[0];
        for (let i = 1; i < this.size; i++) {
            nextPopulation[i] = new Individual(this.crossover(), this.generationCount, this.target.length, this.mutationRate, this.target)
        }
        this.population = nextPopulation;
        this.bestFitness();
        this.averageFitness = this.calculateAverageFitness();
        this._onUpdate?.();
    };

    onUpdate(callback: CallableFunction) {
        this._onUpdate = callback;
    };

    crossover() {
        const remainingChoices: number[] = [];
        remainingChoices[0] = Math.ceil(this.target.length / 2);
        remainingChoices[1] = Math.floor(this.target.length / 2);
        let child: string = "";
        for (let i = 0; i < this.target.length; i++) {
            if (remainingChoices[0] <= 0) {
                child += this.population[1].dna[i];
                remainingChoices[1]--;
                continue;
            }
            if (remainingChoices[1] <= 0) {
                child += this.population[0].dna[i];
                remainingChoices[0]--;
                continue;
            }
            if (Math.random() < 0.5) {
                child += this.population[0].dna[i];
                remainingChoices[0]--;
            }
            else {
                child += this.population[1].dna[i];
                remainingChoices[1]--;
            }
        }
        return (child);
    };

    finished() {
        if (this.population[0].fitness === 0) {
            console.log("Finished !")
            return true;
        }
        return false;
    }

    printList() {
        for (let i = 0; i < this.size; i++) {
            console.log(i + 1 + " : " + this.population[i].fitness);
        }
    };
};