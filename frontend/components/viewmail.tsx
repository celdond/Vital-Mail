import { tokenType, mailType } from './lib/SharedContext';
import { callServer } from './lib/apiCom';
import { useState, useEffect } from 'react';

const getSlip = (setList: Function, id: string, user: tokenType) => {
	const token = user ? user.token : null;
	console.log(token);
	callServer('/mail/' + id, 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			setList(json);
		})
		.catch((err) => {
			alert(`Error retrieving email, please try again.\n${err}`);
		});
};

export interface ViewMailProps {
	id: string;
}

export default function ViewMailPage(props: ViewMailProps) {
	let account: string = '';
	let user: any = {};

	useEffect(() => {
		account = localStorage.getItem(`essentialMailToken`);
		user = JSON.parse(account);
	}, []);

	const [mail, setMail] = useState<mailType>(null);

	useEffect(() => {
		getSlip(setMail, props.id, user);
	}, [mail]);

	return (
		<main>
			<div>{''}</div>
			<div>{''}</div>
		</main>
	);
}
