import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './sidebar.module.scss';


async function getChampionsUUID(): Promise<Object> {
	const url = 'https://valorant-api.com/v1/agents?isPlayableCharacter=true';

	const res = {};

	await axios.get(url).then(r => {

		// eslint-disable-next-line guard-for-in
		for (const c in r.data.data) {
			res[r.data.data[c].displayName] = r.data.data[c].uuid;
		}
	});

	return res;

}

type Props = {
	image: string;
	uuid: string;
	setCurrent: any;
};


function Menu(props: Props) {

	return (
		<button className={styles.menu} type='button' onClick={() => props.setCurrent(props.image)}>
			<img src={`https://media.valorant-api.com/agents/${props.uuid}/displayicon.png`} alt={props.image} className={styles.image} />
		</button>
	);
}


type Champions = {
	champions: string[];
	setCurrent: any;
};

export default function Sidebar(props: Champions) {
	const [uuids, setUuids] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUuid = async () => {
			setUuids(await getChampionsUUID());
			setLoading(false);
		};

		fetchUuid();
	}, [props.setCurrent]);

	if (loading) {
		return null;
	}

	const menus = props.champions.map((c, key) =>
		<Menu
			key={key.toString()}
			image={c}
			setCurrent={props.setCurrent}
			uuid={uuids[c]}
		/>
	);
	return (
		<div id='sidebar' className={styles.sidebar}>
			{menus}
		</div>
	);
}

