import React, { useEffect, useRef, useState } from "react";
import Population from "../../logic/Population.ts"


export default function Main() {
	const [target, setTarget] = useState<string>("hello world");
	const [generationCount, setGenerationCount] = useState<number>(0);
	const [sigma, setSigma] = useState<number>(0.5);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const targetRef = useRef(target);
	const isRunningRef = useRef(isRunning);

	let [population, setPopulation] = useState<Population>(new Population(10, target, 0.1));

	targetRef.current = target;
	isRunningRef.current = isRunning;
	const populationRef = useRef(population)

	function startLoop() {
		function step() {
			if (
				isRunningRef.current && !population.finished()
			) {
				population.nextGen();
				setPopulation(population);
				setTimeout(step, 1);
			}
			else { setIsRunning(false) }
		}
		step();
	}

	useEffect(() => {
		setPopulation(new Population(100, target, 0.1));
	}, [target]);


	return (
		<main>
			<div className="settings">
				<h3>Number of generations : {population.generationCount}</h3>
				<input
					type="text"
					name="target"
					id="target"
					value={target}
					onChange={(e) => setTarget(e.target.value)}
				/>
				<button
					onClick={() => {
						population.printList()
						setIsRunning(true);
						setTimeout(() => startLoop(), 0);
					}}
					disabled={isRunning}
				>
					Run
				</button>
				<button onClick={() => setIsRunning(false)} disabled={!isRunning}>
					Stop
				</button>
				<h2>
					{target}
					<h3>average fitness : {population.calculateAverageFitness()}</h3>
				</h2>

			</div>
			<div className="population">
				{population.population.map((individual, key) => {

					return (
						<h3 key={key}>{target && "-"} {individual.dna?.split("").map((char, i) => {
							return (
								<span className={char === target[i] ? "correct" : "false"}>
									{char}
								</span>
							);
						})} ({individual.calculateFitness(target)})</h3>
					)
				})}
			</div>
		</main>
	);
}
