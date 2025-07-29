const charactersList =
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";


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
    mutationRate:number;

    constructor(dna: string = "", generation: number, length: number,mutationRate:number) {
        if (dna === "") {
            this.dna = randomString(length);
        }
        else {
            this.dna = dna;
            this.mutate(mutationRate);
        }
        this.generation = generation;
        this.length = length;
        this.mutationRate = mutationRate;
    }

    mutate(mutationRate: number) {
        let newDna = "";

        this.dna.split("").map((char: string) => {
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
        this.dna.split("").map((char, i) => {
            const deltaChar = Math.abs(charactersList.indexOf(target[i]) - charactersList.indexOf(char))
            fitnessTotal += Math.min(deltaChar, charactersList.length - deltaChar);
        })
        return fitnessTotal;
    }
};