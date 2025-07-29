import { useEffect, useRef, useState } from "react";
import Population from "../../logic/Population.ts";

export default function Main() {
	const [target, setTarget] = useState<string>("La vie est comme un miroir. Si tu lui souris, elle te renvoie ton image.");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [, setTick] = useState(0);

	const forceUpdate = () => setTick((t) => t + 1);

	const population = useRef(new Population(100, target, 0.1));

	useEffect(() => {
		population.current.onUpdate(forceUpdate);
	}, []);

	const targetRef = useRef(target);
	const isRunningRef = useRef(isRunning);

	targetRef.current = target;
	isRunningRef.current = isRunning;

	function startLoop() {
		function step() {
			if (isRunningRef.current && !population.current.finished()) {
				population.current.nextGen();
				setTimeout(step, 1);
			}
		}
		step();
	}

	useEffect(() => {
		
	}, [target]);

	return (
		<main>
			<div className="settings">
				<h3>Number of generations : {population.current.generationCount}</h3>
				<input
					type="text"
					name="target"
					id="target"
					value={target}
					onChange={(e) => setTarget(e.target.value)}
				/>
				<button
					onClick={() => {
						population.current.printList();
						setIsRunning(true);
						setTimeout(() => startLoop(), 0);
					}}
					disabled={isRunning}
				>
					Run
				</button>
				<button
					onClick={() => setIsRunning(false)}
					disabled={!isRunning}
				>
					Stop
				</button>
				<h2>
					{target}
					<h3>
						average fitness : {population.current.calculateAverageFitness()}
					</h3>
				</h2>
			</div>
			<div className="population">
				{population.current.population.map((individual, key) => {
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
