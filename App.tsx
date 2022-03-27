import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import React, {useRef, useState, useCallback, useEffect, Suspense} from 'react';
import ReactDOM from 'react-dom';
import useMeasure from 'react-use-measure';
import {TextureLoader, Vector2} from 'three';
import Image from './Image';
import dynamixBackgroundImg from './images/dynamix-background.png';
import dynamixNoteImg from './images/dynamix-note.png';
import dynamixNoteImg2 from './images/dynamix-note2.png';
import dynamixNoteImg3 from './images/dynamix-note3.png';

const Box = (props) => {
	const ref = useRef();

	const [hover, setHover] = useState(false);
	const [click, setClick] = useState(false);

	useFrame(() => {
		ref.current.rotation.x += 0.01;
		ref.current.rotation.y += 0.01;
	});

	const handlePointerOver = useCallback(() => setHover(true), [setHover]);
	const handlePointerOut = useCallback(() => setHover(false), [setHover]);
	const handleClick = useCallback(() => setClick(!click), [setClick, click]);

	return (
		<mesh
			{...props}
			ref={ref}
			scale={click ? 1.5 : 1}
			onClick={handleClick}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
		>
			<boxGeometry args={[100, 100, 100]}/>
			<meshLambertMaterial color={hover ? 'hotpink' : 'orange'}/>
		</mesh>
	);
};

const NoteLeft = (props: {x: number, y: number, width: number}) => {
	const texture = useLoader(TextureLoader, dynamixNoteImg2 as string);
	texture.offset = new Vector2(0, 0);
	texture.repeat.set(0.45, 1);

	return (
		<sprite
			position={[props.x - props.width / 2 - texture.image.width * 0.45 / 4, props.y, -200]}
			scale={[texture.image.width * 0.45 / 2, texture.image.height / 2, 1]}
		>
			<spriteMaterial attach="material" map={texture} sizeAttenuation={false}/>
		</sprite>
	);
};

const NoteCenter = (props: {x: number, y: number, width: number}) => {
	const texture = useLoader(TextureLoader, dynamixNoteImg as string);
	texture.offset = new Vector2(0.45, 0);
	texture.repeat.set(0.1, 1);

	return (
		<sprite position={[props.x, props.y, -200]} scale={[props.width, texture.image.height / 2, 1]}>
			<spriteMaterial attach="material" map={texture} sizeAttenuation={false}/>
		</sprite>
	);
};

const NoteRight = (props: {x: number, y: number, width: number}) => {
	const texture = useLoader(TextureLoader, dynamixNoteImg3 as string);
	texture.offset = new Vector2(0.55, 0);
	texture.repeat.set(0.45, 1);

	return (
		<sprite
			position={[props.x + props.width / 2 + texture.image.width * 0.45 / 4, props.y, -200]}
			scale={[texture.image.width * 0.45 / 2, texture.image.height / 2, 1]}
		>
			<spriteMaterial attach="material" map={texture} sizeAttenuation={false}/>
		</sprite>
	);
};

const startTime = Date.now();

const Note = (props: {x: number, y: number, width: number}) => {
	const [timer, setTimer] = useState(0);

	useFrame(() => {
		const time = Date.now();
		setTimer(time - startTime);
	});

	const offset = 0;

	return (
		<group>
			<NoteLeft x={props.x} y={props.y + offset} width={props.width}/>
			<NoteCenter x={props.x} y={props.y + offset} width={props.width}/>
			<NoteRight x={props.x} y={props.y + offset} width={props.width}/>
		</group>
	);
};

const Background = () => {
	const [timer, setTimer] = useState(Date.now());

	useFrame(() => {
		const time = Date.now();
		setTimer(time);
	});

	return (
		<Image
			src={dynamixBackgroundImg as string}
			x={0}
			y={0}
			zIndex={-200}
			width={1024}
			rotation={timer * 0}
		/>
	);
};

const SceneController = () => {
	const setSize = useThree((state) => state.setSize);
	setSize(1024, 768);
	window.scrollTo(0, 1);

	useEffect(() => {
		const resizeListener = () => {
			setSize(1024, 768);
		};
		window.addEventListener('resize', resizeListener);
		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	return <></>;
};

const getRgb = (color: string): [number, number, number] => {
	if (color === 'black') {
		return [0, 0, 0];
	}
	if (color === 'red') {
		return [255, 0, 0];
	}
	if (color === 'green') {
		return [0, 255, 0];
	}
	if (color === 'blue') {
		return [0, 0, 255];
	}
	if (color === 'white') {
		return [255, 255, 255];
	}
	return [0, 0, 0];
};

const getCorrectedDimension = (screenWidth: number, screenHeight: number, screenX: number, screenY: number): [number, number] => {
	console.log({screenWidth, screenHeight, screenX, screenY});
	const zoom = Math.min(screenWidth / 1024, screenHeight / 768);
	const x = screenWidth / 2;
	const y = screenHeight / 2;
	return [(screenX - x) / zoom, -(screenY - y) / zoom];
};

const App = () => {
	const [notes, setNotes] = useState<{x: number, y: number, createdAt: number}[]>([]);
	const [ref, bounds] = useMeasure();
	const canvasEl = useRef(null);

	const handlePointerDown = useCallback((event: React.TouchEvent) => {
		for (const i of Array.from(Array(event.changedTouches.length).keys())) {
			const touch = event.changedTouches.item(i);
			const [x, y] = getCorrectedDimension(bounds.width, bounds.height, touch.clientX, touch.clientY);
			setNotes((prevNotes) => [...prevNotes, {x, y, createdAt: Date.now()}]);
		}
	}, [setNotes, notes]);

	const now = Date.now();

	return (
		<div ref={ref} style={{width: '100%', height: '100%'}} onTouchStart={handlePointerDown}>
			<Canvas ref={canvasEl} orthographic camera={{zoom: 1}}>
				<SceneController/>
				<color attach="background" args={getRgb('black')}/>
				<ambientLight/>
				<Box position={[0, -300, -100]}/>
				<Suspense fallback={<>Loading...</>}>
					<Background/>
					<Note x={0} y={0} width={300}/>
					{notes.map((note, index) => (
						now - note.createdAt < 1000 && <Note key={index} x={note.x} y={note.y} width={30}/>
					))}
				</Suspense>
			</Canvas>
		</div>
	);
};

ReactDOM.render(
	<App/>,
	document.getElementById('root'),
);
