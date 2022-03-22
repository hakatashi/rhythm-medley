import {Canvas, useFrame} from '@react-three/fiber';
import React, {useRef, useState, useCallback} from 'react';
import ReactDOM from 'react-dom';

const Box = (props) => {
	const ref = useRef();

	const [hover, setHover] = useState(false);
	const [click, setClick] = useState(false);

	useFrame(() => (ref.current.rotation.x += 0.01));

	const handlePointerOver = useCallback(() => setHover(true), [setHover]);
	const handlePointerOut = useCallback(() => setHover(false), [setHover]);
	const handleClick = useCallback(() => setClick(true), [setClick]);

	return (
		<mesh
			{...props}
			ref={ref}
			scale={click ? 1.5 : 1}
			onClick={handleClick}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
		>
			<boxGeometry args={[1, 1, 1]}/>
			<meshStandardMaterial color={hover ? 'hotpink' : 'orange'}/>
		</mesh>
	);
};

ReactDOM.render(
	<Canvas>
		<ambientLight/>
		<pointLight position={[10, 10, 10]}/>
		<Box position={[-1.2, 0, 0]}/>
		<Box position={[1.2, 0, 0]}/>
	</Canvas>,
	document.getElementById('root'),
);
