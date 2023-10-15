
/* eslint-disable react/button-has-type */
import React from 'react';
import ReactPlayer from 'react-player/youtube';
import styles from './videos.module.scss';

type VideoProps = {
	videoLink: string;
};

function Video(props: VideoProps) {
	const url = ['https://www.youtube.com/watch?v=', props.videoLink].join('');

	return (
		<ReactPlayer
			className={styles.video}
			url={url}
			controls={true}
		/>
	);
}

type Props = {
	videos: any;
};

export default function Videos(props: Props) {
	const videos = props.videos.map((c, key) =>
		<Video
			key={`${key.toString()}video`}
			videoLink={c}
		/>
	);
	return (
		<div className={styles.videoMenu}>
			{videos}
		</div>
	);
}

