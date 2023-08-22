import { tokenType, mailType } from './lib/SharedContext';
import { callServer } from './lib/apiCom';
import { useState, useEffect } from 'react';

const getSlip = (setList: Function, id: string, user: tokenType) => {
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
			setList(json);
		})
		.catch((err) => {
			alert(`Error retrieving email, please try again.\n${err}`);
		});
}

export interface ViewMailProps {
	mid: string;
}

export default function ViewMailPage(props: ViewMailProps) {
	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);
    const [mail, setMail] = useState<mailType>(null);

    useEffect(() => {
		getSlip(setMail, props.mid, user);
	}, [mail]);

	return <main>{mail.content}</main>;
}
