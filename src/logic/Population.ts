import Individual from "./Individual.ts";


export default class Population {
    size = 10;
    target: string;
    mutationRate = 0.1;
    population: Individual[] = [];
    averageFitness: number;
    generationCount: number;

    constructor(size: number, target: string, mutationRate: number) {
        this.size = size;
        this.target = target;
        this.mutationRate = mutationRate;
        this.population = [];
        this.averageFitness = 0;
        this.generationCount = 1;

        for (let i = 0; i < this.size; i++) {
            this.population.push(new Individual("", this.generationCount, target.length, this.mutationRate));
        };
        this.bestFitness();
    };

    bestFitness() {
        this.population = this.population.sort((a, b) => a.calculateFitness(this.target) - b.calculateFitness(this.target));
    };

    calculateAverageFitness(){
        let averageFitness = 0;
        for (let i = 0; i < this.size; i++) {
            averageFitness += this.population[i].calculateFitness(this.target);
        };
        averageFitness /= this.size;
        return averageFitness;
    }

    nextGen() {
        let nextPopulation: Individual[] = [];
        this.generationCount++;
        this.bestFitness();
        nextPopulation[0] = this.population[0];
        for (let i = 1; i < this.size; i++) {
            nextPopulation[i] = new Individual(this.crossover(), this.generationCount, this.target.length, this.mutationRate)
        }
        this.population = nextPopulation;
        console.log(this.population[0].calculateFitness(this.target));
    };

    crossover() {
        let remainingChoices: number[] = [];
        remainingChoices[0] = Math.ceil(this.target.length / 2);
        remainingChoices[1] = Math.floor(this.target.length / 2);
        this.bestFitness();
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

    finished(){
        this.bestFitness();
        if(this.population[0].calculateFitness(this.target)===0){
            console.log("Finished !")
            return true;
        }
        return false;
    }

    printList() {
        for (let i = 0; i < this.size; i++) {
            console.log(i + 1 + " : " + this.population[i].calculateFitness(this.target));
        }
    };
};