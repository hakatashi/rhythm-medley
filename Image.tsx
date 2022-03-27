import {ThreeEvent, useLoader} from '@react-three/fiber';
import React from 'react';
import {TextureLoader} from 'three';

type ImageProps = {
	src: string,
	x: number,
	y: number,
	zIndex?: number,
	width?: number,
	height?: number,
	scaleX?: number,
	scaleY?: number,
	rotation?: number,
	onClick?: (event: ThreeEvent<MouseEvent>) => void,
} & typeof defaultProps;

const defaultProps = {
	zIndex: 0,
	rotation: 0,
	width: 0,
	height: 0,
	scaleX: 1,
	scaleY: 1,
	onClick: null,
};

const Image = ({x, y, zIndex, width, height, scaleX, scaleY, src, rotation, onClick}: ImageProps) => {
	const texture = useLoader(TextureLoader, src);

	let renderWidth = width;
	let renderHeight = height;

	if (renderWidth === 0 && renderHeight == 0) {
		renderWidth = texture.image.width * scaleY;
		renderHeight = texture.image.height * scaleX;
	} else if (renderWidth === 0) {
		renderWidth = renderHeight * texture.image.width / texture.image.height;
	} else if (renderHeight === 0) {
		renderHeight = renderWidth * texture.image.height / texture.image.width;
	}

	return (
		<sprite
			position={[x, y, zIndex]}
			scale={[renderWidth, renderHeight, 1]}
			onClick={onClick}
		>
			<spriteMaterial
				attach="material"
				map={texture}
				sizeAttenuation={false}
				rotation={rotation}
			/>
		</sprite>
	);
};

Image.defaultProps = defaultProps;

export default Image;
