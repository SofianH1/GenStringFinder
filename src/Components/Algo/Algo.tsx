import { useEffect, useRef, useState } from "react";
import Population from "../../logic/Population.ts";

export default function Main() {
	const [target, setTarget] = useState<string>("Hello World!");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const populationRef = useRef<Population | null>(null);
	const [, setTick] = useState(0);

	useEffect(() => {
		populationRef.current = new Population(1000, target, 0.1);
		setIsRunning(false);
		setTick(t => t + 1);
	}, [target]);

	useEffect(() => {
		if (!isRunning) return;
		let frameId: number;

		const loop = () => {
			const pop = populationRef.current;
			if (!pop) return;
			if (pop.finished()) {
				setTick(t => t + 1);
				setIsRunning(false);
				return;
			}
			pop.nextGen();
			if (pop.generationCount % 5 == 0)
				setTick(t => t + 1);
			frameId = requestAnimationFrame(loop);
		};

		frameId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frameId);
	}, [isRunning]);

	const population = populationRef.current;

	if (!population) return <div>Loading...</div>;

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
					className="runButton"
					onClick={() => setIsRunning(true)}
					disabled={isRunning || target.length < 1}
				>
					Run
				</button>
				<button
					className="stopButton"
					onClick={() => setIsRunning(false)}
					disabled={!isRunning}
				>
					Stop
				</button>
				<h2>Target :</h2>
				<h2>
					{target}
				</h2>
				<br />
				<h2>fitness (the lower, the better)</h2>
				<h3>
					average fitness : {population.averageFitness}
				</h3>
				<h3>
					fittest : {population.population[0].calculateFitness(target)}
				</h3>
			</div>
			<div className="population">
				{population.population.slice(0, 10).map((individual, key,) => {
					return (
						<h3 key={key}>
							{target && "-"}{" "}
							{individual.dna?.split("").map((char, i) => {
								return (
									<span
										className={
											char === target[i]
												? "correct"
												: "false"
										}
									>
										{char}
									</span>
								);
							})}{" "}
							({individual.calculateFitness(target)})
						</h3>
					);
				})}
			</div>
		</main>
	);
}
