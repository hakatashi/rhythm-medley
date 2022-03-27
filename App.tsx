import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import React, {useRef, useState, useCallback, Suspense} from 'react';
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
			position={[props.x - props.width / 2 - texture.image.width * 0.45 / 2, props.y, -200]}
			scale={[texture.image.width * 0.45, texture.image.height, 1]}
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
		<sprite position={[props.x, props.y, -200]} scale={[props.width, texture.image.height, 1]}>
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
			position={[props.x + props.width / 2 + texture.image.width * 0.45 / 2, props.y, -200]}
			scale={[texture.image.width * 0.45, texture.image.height, 1]}
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

	const offset = -(timer / 100 % 1000);

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
		setTimer(time - startTime);
	});

	return (
		<Image src={dynamixBackgroundImg as string} x={0} y={0} zIndex={-200} width={1024} rotation={timer * 0}/>
	);
};

const SceneController = () => {
	const setSize = useThree((state) => state.setSize);
	setSize(1024, 768);

	return '';
};

const App = () => (
	<Canvas orthographic camera={{zoom: 1}}>
		<SceneController/>
		<color attach="background" args={[0, 0, 0]}/>
		<ambientLight/>
		<Box position={[0, -300, -100]}/>
		<Suspense fallback={<>Loading...</>}>
			<Background/>
			<Note x={0} y={0} width={300}/>
			<Note x={200} y={250} width={150}/>
		</Suspense>
	</Canvas>
);

ReactDOM.render(
	<App/>,
	document.getElementById('root'),
);
