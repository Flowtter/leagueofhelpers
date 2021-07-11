/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SelectPicker, Button, IconButton, Icon } from 'rsuite';
import styles from './topbar.module.scss';

type Champ = {
	label: string;
	value: string;
};

function getChampions(setChampions: any) {
	const url = 'https://ddragon.leagueoflegends.com/cdn/11.12.1/data/en_US/champion.json';
	axios.get(url).then(r => {
		setChampions(r.data.data);
		return r.data.data.length;
	});
}

type Props = {
	addChampions: any;
	champions: any;
	api: any;
	current: any;
};

function openVideoForChampion(champion: string, api: any) {
	const notify = (err: string) => toast.error(err);
	const date = new Array<string>();
	const cvideos = new Array<string>();
	api.searchAll(['Challenger Replays', champion].join(' '), 10)
		.then((data) => {
			const objs = data['items'];
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
			window.open(`https://www.youtube.com/watch?v=${cvideos[0]}`, '_blank');
		}, (err) => {
			notify(err);
		});
}


function random(champions: any, api: any) {
	var champ = champions[Math.floor(Math.random() * champions.length)];
	openVideoForChampion(champ.label, api);
}

function addChampion(addChampions: any, champions: any, value: string, setValue: any) {
	if (value === '' || value === null || value === undefined) {
		return;
	}
	setValue(value);
	if (!champions.includes(value)) {
		addChampions(prevArray => [...prevArray, value]);
		const retrievedObject = localStorage.getItem('champions');
		localStorage.setItem('champions', [retrievedObject, value].join('/'));
	}
}

function del(value: any, champions: any, addChampions: any) {
	if (value === '' || value === null || value === undefined) {
		return;
	}
	let tmp = [...champions].join('/');
	tmp = tmp.replace([value, '/'].join(''), '');
	tmp = tmp.replace(['/', value].join(''), '');
	const result = tmp.split('/');
	addChampions(result);
	localStorage.setItem('champions', tmp);
}

export default function Topbar(props: Props) {
	const [champions, setChampions] = useState<Array<Champ>>(new Array<Champ>());
	const [value, setValue] = useState(String);
	useEffect(() =>
		getChampions(setChampions), []
	);
	return (
		<div id='topbar' className={styles.topbar}>
			<SelectPicker
				data={Object.keys(champions).map(key => ({ label: key, value: key }))}
				placeholder='Add a champion'
				onChange={v => addChampion(props.addChampions, props.champions, v, setValue)}
				style={{ width: 200 }}
				className={styles.picker}
			/>

			<IconButton icon={<Icon icon='trash' />} className={styles.button} onClick={() => del(value, props.champions, props.addChampions)} />
			<IconButton icon={<Icon icon='search' />} className={styles.button} onClick={() => openVideoForChampion(props.current, props.api)} />
			<IconButton icon={<Icon icon='search-peoples' />} className={styles.button} onClick={() => random(Object.keys(champions).map(key => ({ label: key, value: key })), props.api)} />
		</div>
	);
}

