import { useEffect, useRef, useState } from "react";

const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.!? ";

function randomString(length: number): string {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}

function fitness(target: string, current: string): number {
	let score = 0;
	for (let i = 0; i < target.length; i++) {
		if (target[i] === current[i]) {
			score += 1;
		}
	}
	return score;
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
				setCurrent(randomString(targetRef.current.length));
				setGenerationCount((prev) => prev + 1);
				setTimeout(step, 1);
			}
		}
		step();
	}

	useEffect(() => {
		setCurrent(randomString(target.length));
	}, [target]);

	return (
		<main>
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
					setCurrent(randomString(target.length));
				}}
			>
				Generate
			</button>
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
				{target?.split("").map((char, i) => {
					return (
						<span className={char === current[i] ? "correct" : ""}>
							{char}
						</span>
					);
				})}
			</h2>
			<h2>{current}</h2>
			<h3>fitness : {fitness(target, current)}</h3>
		</main>
	);
}
