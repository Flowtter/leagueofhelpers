import React from 'react';
import styles from './sidebar.module.scss';

type Props = {
	image: string;
	setCurrent: any;
};

function Menu(props: Props) {
	const img = props.image.replaceAll('"', '');
	if (img === '' || img === null || img === undefined) {
		return null;
	}
	return (
		<button className={styles.menu} type='button' onClick={() => props.setCurrent(img)}>
			<img src={`https://ddragon.leagueoflegends.com/cdn/11.12.1/img/champion/${img}.png`} alt={img} className={styles.image} />
		</button>
	);
}

type Champions = {
	champions: string[];
	setCurrent: any;
};

export default function Sidebar(props: Champions) {
	const menus = props.champions.map((c, key) =>
		<Menu
			key={`${key.toString()}menu`}
			image={c}
			setCurrent={props.setCurrent}
		/>
	);
	return (
		<div id='sidebar' className={styles.sidebar}>
			{menus}
		</div>
	);
}

