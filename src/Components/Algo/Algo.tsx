import { useEffect, useRef, useState } from "react";
import Population from "../../logic/Population.ts";
import Graph from "../Graph/Graph.tsx";

export default function Main() {
	const [target, setTarget] = useState<string>("Hello World!");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [stepSkip, setStepSkip] = useState(5);
	const [populationSize, setPopulationSize] = useState(1000);
	const [mutationRate, setMutationRate] = useState(1);
	const graphDataRef = useRef<number[]>([])
	const populationRef = useRef<Population | null>(null);
	const [, setTick] = useState(0);

	useEffect(() => {
		populationRef.current = new Population(populationSize, target, mutationRate / 100);
		graphDataRef.current = [];
		setIsRunning(false);
		setTick(t => t + 1);
	}, [target, populationSize, mutationRate]);

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
			if (pop.generationCount % stepSkip == 0)
				setTick(t => t + 1);
				graphDataRef.current.push(pop.averageFitness);
			frameId = requestAnimationFrame(loop);
		};

		frameId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frameId);
	}, [isRunning]);

	const population = populationRef.current;

	if (!population) return <div>Loading...</div>;

	return (
		<main>
			<div id="settings">
				<h3>SETTINGS :</h3>
				<div id="settingsInputs">

					<div id="target">
						<label htmlFor="targetInput">Target : </label>
						<input
							type="text"
							id="targetInput"
							value={target}
							onChange={(e) => setTarget(e.target.value)}
						/>
						<p>Target length : {target.length}</p>
					</div>
					<div id="parameters">

						<div id="populationSize">
							<label htmlFor="populationSizeInput">Population size : </label>
							<input
								id="populationSizeInput"
								type="number"
								min={10}
								max={100000}
								value={populationSize}
								onChange={(e) => setPopulationSize(+e.target.value)} />
						</div>

						<div id="mutationRate">
							<label htmlFor="mutationRateInput">Mutation rate : </label>
							<input
								id="mutationRateInput"
								type="number"
								min={0}
								max={100} value={mutationRate}
								onChange={(e) => setMutationRate(+e.target.value)} />
						</div>

						<div id="stepSkip">
							<label htmlFor="stepSkipInput">Display each </label>
							<input
								id="stepSkipInput"
								type="number"
								min={1}
								value={stepSkip}
								onChange={(e) => setStepSkip(+e.target.value)} />
							<label htmlFor="stepSkipInput"> generation(s)</label>
						</div>
					</div>
				</div>
				<div id="settingButtons">
					<button
						id="runButton"
						onClick={() => setIsRunning(true)}
						disabled={isRunning || target.length < 1}
					>
						Run
					</button>
					<button
						id="stopButton"
						onClick={() => setIsRunning(false)}
						disabled={!isRunning}
					>
						Stop
					</button>
				</div>
			</div>
			<div id="infos">
				<h3>INFOS :</h3>
				<p>Number of generations : {population.generationCount}</p>
				<p id="fitnessInfos">Fitness (the lower, the better) :</p>
				<p>-Average fitness : {population.averageFitness}</p>
				<p>-Fittest : {population.population[0].calculateFitness(target)}</p>
				<Graph data={population.graphData.averageFitness}/>
			</div>
			<div id="population">
				{population.population.slice(0, 14).map((individual, key,) => {
					return (
						<h3 key={key}>
							({individual.calculateFitness(target)}){" "}
							{target && "-"}{" "}
							{individual.dna?.split("").map((char, i) => {
								return (
									<span key={i}
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
						</h3>
					);
				})}
			</div>
		</main>
	);
}