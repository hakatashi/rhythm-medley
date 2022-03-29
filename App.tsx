import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import React, {useRef, useState, useCallback, useEffect, Suspense} from 'react';
import {Transition, TransitionGroup} from 'react-transition-group';
import {AdditiveBlending, NormalBlending, TextureLoader, Vector2} from 'three';
import Image from './Image';
import dynamixBackgroundImg from './images/dynamix-background.png';
import dynamixHollowImg from './images/dynamix-hollow.png';
import dynamixNoteImg from './images/dynamix-note.png';
import dynamixNoteImg2 from './images/dynamix-note2.png';
import dynamixNoteImg3 from './images/dynamix-note3.png';
import {isTouchDevice} from './lib/util';

const NoteLeft = (props: {x: number, y: number, width: number}) => {
	const texture = useLoader(TextureLoader, dynamixNoteImg2);
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
	const texture = useLoader(TextureLoader, dynamixNoteImg);
	texture.offset = new Vector2(0.45, 0);
	texture.repeat.set(0.1, 1);

	return (
		<sprite position={[props.x, props.y, -200]} scale={[props.width, texture.image.height / 2, 1]}>
			<spriteMaterial attach="material" map={texture} sizeAttenuation={false}/>
		</sprite>
	);
};

const NoteRight = (props: {x: number, y: number, width: number}) => {
	const texture = useLoader(TextureLoader, dynamixNoteImg3);
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

const Note = (props: {x: number, y: number, width: number}) => {
	const offset = 0;
	return (
		<group>
			<NoteLeft x={props.x} y={props.y + offset} width={props.width}/>
			<NoteCenter x={props.x} y={props.y + offset} width={props.width}/>
			<NoteRight x={props.x} y={props.y + offset} width={props.width}/>
		</group>
	);
};

const Background = () => (
	<Image
		src={dynamixBackgroundImg}
		x={0}
		y={0}
		zIndex={-200}
		width={1024}
	/>
);

const SceneController = () => {
	const setSize = useThree((state) => state.setSize);
	setSize(1024, 768);

	useEffect(() => {
		const resizeListener = () => {
			setSize(1024, 768);
		};
		window.addEventListener('resize', resizeListener);
		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	// eslint-disable-next-line react/jsx-no-useless-fragment
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
	const zoom = Math.min(screenWidth / 1024, screenHeight / 768);
	const offsetX = screenWidth / 2;
	const offsetY = screenHeight / 2;
	return [(screenX - offsetX) / zoom, -(screenY - offsetY) / zoom];
};

const DynamixHollow = ({x}: {x: number}) => {
	const [timer, setTimer] = useState(0);
	const [initTime, setInitTime] = useState(Date.now());

	useFrame(() => {
		setTimer(Date.now() - initTime);
	});

	return (
		<Image
			x={x}
			y={-5}
			height={576}
			src={dynamixHollowImg}
			blending={NormalBlending}
			opacity={Math.max((300 - timer) / 300, 0)}
		/>
	);
};

const App = () => {
	const [notes, setNotes] = useState<{x: number, y: number, createdAt: number}[]>([]);
	const canvasEl = useRef(null);

	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			setScreenHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const handleTouchStart = useCallback((event: React.TouchEvent) => {
		for (const i of Array.from(Array(event.changedTouches.length).keys())) {
			const touch = event.changedTouches.item(i);
			const [x, y] = getCorrectedDimension(screenWidth, screenHeight, touch.clientX, touch.clientY);
			setNotes((prevNotes) => [...prevNotes, {x, y, createdAt: Date.now()}]);
		}
	}, [setNotes]);

	const handlePointerDown = useCallback((event: React.MouseEvent) => {
		if (isTouchDevice) {
			return;
		}
		const [x, y] = getCorrectedDimension(screenWidth, screenHeight, event.clientX, event.clientY);
		setNotes([{x, y, createdAt: Date.now()}]);
	}, [setNotes]);

	return (
		<div
			style={{width: '100%', height: '100%'}}
			onTouchStart={handleTouchStart}
			onPointerDown={handlePointerDown}
		>
			<Canvas ref={canvasEl} orthographic camera={{zoom: 1}}>
				<SceneController/>
				<color attach="background" args={getRgb('black')}/>
				<ambientLight/>
				<Suspense fallback={<>Loading...</>}>
					<Background/>
					<Note x={0} y={0} width={300}/>
					<TransitionGroup component="group">
						{notes.map((note) => (
							<Transition key={note.createdAt} in={false} timeout={500} unmountOnExit>
								<DynamixHollow x={note.x}/>
							</Transition>
						))}
					</TransitionGroup>
				</Suspense>
			</Canvas>
		</div>
	);
};

export default App;
