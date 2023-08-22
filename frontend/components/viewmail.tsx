import type { NextPage } from 'next';
import { tokenType } from './lib/SharedContext';
import { callServer } from './lib/apiCom';

const getSlip = (id: string, user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mail/' + id, 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			return json;
		})
		.catch((err) => {
			alert(`Error retrieving email, please try again.\n${err}`);
		});
};

export interface ViewMailProps {
	mid: string;
}

export default function ViewMailPage(props: ViewMailProps) {
	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);
	const email = getSlip(props.mid, user);
	return <main></main>;
}
