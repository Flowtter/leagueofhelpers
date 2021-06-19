/* eslint-disable arrow-body-style */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SelectPicker, Button } from 'rsuite';
import styles from './topbar.module.scss';

type Champ = {
	label: string;
	value: string;
};

function getChampions(setChampions: any) {
	const url = 'http://ddragon.leagueoflegends.com/cdn/11.12.1/data/en_US/champion.json';
	axios.get(url).then(r => {
		setChampions(r.data.data);
	});
}

type Props = {
	addChampions: any;
	champions: any;
};

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
			<Button
				className={styles.picker}
				onClick={() => del(value, props.champions, props.addChampions)}
				type="button"
			>
				Delete
			</Button>
		</div>
	);
}

