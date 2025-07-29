import Individual from "./Individual";


export default class Population {
    size = 10;
    target: string;
    mutation = 10;
    population: Individual[] = []

    constructor(size: number, target: string, mutation: number) {
        this.size = size;
        this.target = target;
        this.mutation = mutation;
        this.population = []

        for (let i = 0; i < this.size; i++) {
            this.population.push(new Individual("",0,target.length))
        }
    }
};