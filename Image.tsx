import {useLoader} from '@react-three/fiber';
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
} & typeof defaultProps;

const defaultProps = {
	zIndex: 0,
	rotation: 0,
	width: 0,
	height: 0,
	scaleX: 1,
	scaleY: 1,
};

const Image = ({x, y, zIndex, width, height, scaleX, scaleY, src, rotation}: ImageProps) => {
	const texture = useLoader(TextureLoader, src);

	const renderWidth = width === 0 ? texture.image.width * scaleY : width;
	const renderHeight = height === 0 ? texture.image.height * scaleX : height;

	return (
		<sprite
			position={[x, y, zIndex]}
			scale={[renderWidth, renderHeight, 1]}
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
