/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { YoutubeDataAPI } from 'youtube-v3-api';
import { toast, ToastContainer } from 'react-toastify';

import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import Videos from './components/videos';

import './styles/styles.css';
import 'rsuite/dist/styles/rsuite-dark.css';
import 'react-toastify/dist/ReactToastify.css';

function getVideosForChampion(setVideos: any, champion: string, api: any) {
	const notify = (err: string) => toast.error(err);
	const date = new Array<string>();
	const cvideos = new Array<string>();
	api.searchAll(['Challenger Replays', champion].join(' '), 10)
		.then((data) => {
			const objs = data['items'];
			setVideos(new Array<string>());
			objs.forEach(element => {
				if (element !== undefined && element['id']['kind'] === 'youtube#video' && element['snippet']['channelId'] === 'UCsVz2qkd_oGXGC66fcH4SFA') {
					cvideos.push(element['id']['videoId']);
					date.push(element['snippet']['publishedAt']);
				}
			});
			let min;
			for (let i = 0; i < date.length; i++) {
				min = i;
				for (let j = i + 1; j < date.length; j++) {
					if (date[j] < date[min]) {
						min = j;
					}
				}
				if (min !== i) {
					[date[i], date[min]] = [date[min], date[i]];
					[cvideos[i], cvideos[min]] = [cvideos[min], cvideos[i]];
				}
			}
			cvideos.reverse();
			setVideos(cvideos);

		}, (err) => {
			notify(err);
		});
}

function storageSidebar(champions: any, addChampions: any) {
	const retrievedObject = localStorage.getItem('champions');
	if (retrievedObject === null) {
		localStorage.setItem('champions', champions.join('/'));
	} else if (champions.join('/') !== retrievedObject) {
		addChampions(retrievedObject.split('/'));
	}
}

export default function App() {
	const [champions, addChampions] = useState<Array<string>>(new Array<string>('Jhin'));

	useEffect(() => storageSidebar(champions, addChampions), []);
	const api = new YoutubeDataAPI(process.env.REACT_APP_API_KEY!);
	const [videos, setVideos] = useState<Array<string>>(new Array<string>());

	const [current, setCurrent] = useState<string>('Jhin');
	useEffect(() => getVideosForChampion(setVideos, current, api), [current]);

	return (
		<div id='body'>
			<ToastContainer />
			<Sidebar
				champions={champions}
				setCurrent={setCurrent}
			/>
			<Topbar
				addChampions={addChampions}
				champions={champions}
			/>
			<Videos
				videos={videos}
			/>
		</div>
	);
}

