import React from 'react';

const FaceRecognition = ({imageUrl}) => {
	return (
		<div className='center ma'>
			<div className='center mt2'>
				<img alt='' src={imageUrl} width='500px' height='100%' />
			</div>
		</div>
	);
}

export default FaceRecognition;