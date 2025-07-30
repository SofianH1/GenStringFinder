const charactersList =
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

const charMap: { [key: string]: number } = {};
charactersList.split("").forEach((char, index)=>{
    charMap[char] = index;
})
function randomChar() {
    return charactersList.charAt(Math.floor(Math.random() * charactersList.length));
}

function randomString(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += randomChar();
    }
    return result;
}

export default class Individual {
    dna: string;
    generation: number;
    length: number;
    fitness:number;

    constructor(dna: string = "", generation: number, length: number,mutationRate:number,target:string) {
        if (dna === "") {
            this.dna = randomString(length);
        }
        else {
            this.dna = dna;
            this.mutate(mutationRate);
        }
        this.generation = generation;
        this.length = length;
        this.fitness = this.calculateFitness(target);
    }

    mutate(mutationRate: number) {
        let newDna = "";

        this.dna.split("").forEach((char: string) => {
            if (Math.random() < mutationRate) {
                char = randomChar();
            }
            newDna += char;
        }
        )
        this.dna = newDna;
    }

    calculateFitness(target: string) {
        let fitnessTotal = 0;
        this.dna.split("").forEach((char, i) => {
            const deltaChar = Math.abs(charMap[target[i]] - charMap[char])
            fitnessTotal += Math.min(deltaChar, charactersList.length - deltaChar);
        })
        return fitnessTotal;
    }
};