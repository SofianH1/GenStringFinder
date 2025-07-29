import { useEffect, useRef, useState } from "react";
import Population from "../../logic/Population"


function fitness(target: string, current: string): number {
	let score = 0;
	for (let i = 0; i < target.length; i++) {
		if (target[i] === current[i]) {
			score += 1;
		}
	}
	return score;
}

const characters =
	" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

function randomString(length: number): string {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}

export default function Main() {
	const [target, setTarget] = useState<string>("hello world");
	const [current, setCurrent] = useState<string>(randomString(11));
	const [generationCount, setGenerationCount] = useState<number>(0);
	const [sigma, setSigma] = useState<number>(0.5);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	const currentRef = useRef(current);
	const targetRef = useRef(target);
	const isRunningRef = useRef(isRunning);

	let population = new Population(10, target, 0.1);

	currentRef.current = current;
	targetRef.current = target;
	isRunningRef.current = isRunning;

	function startLoop() {
		function step() {
			console.log("current : " + currentRef.current);
			if (
				currentRef.current !== targetRef.current &&
				isRunningRef.current
			) {
				setGenerationCount((prev) => prev + 1);
				setTimeout(step, 1);
			}
		}
		step();
	}

	useEffect(() => {
		population = new Population(10, target, 0.1)
	}, [target]);

	return (
		<main>
			<div className="settings">
				<h3>Number of generations : {generationCount}</h3>
				<input
					type="text"
					name="target"
					id="target"
					value={target}
					onChange={(e) => setTarget(e.target.value)}
				/>
				<button
					onClick={() => {
						setIsRunning(true);
						setTimeout(() => startLoop(), 0);
					}}
					disabled={isRunning}
				>
					Find String
				</button>
				<button onClick={() => setIsRunning(false)} disabled={!isRunning}>
					Stop
				</button>
				<h2>
					{target}
					<h3>average fitness : {fitness(target, current)}</h3>
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
						})}</h3>
					)
				})}
			</div>
		</main>
	);
}
