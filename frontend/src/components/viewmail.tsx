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
			console.log(err);
		});
};

export interface ViewMailProps {
	id: string;
}

const emptyMail = {
	id: '',
	from: {
        name: '',
        email: '',
    },
    to: {
        name: '',
        email: '',
    },
    subject: '',
    content: '',
    time: '',
    timestamp: '',
};

export default function ViewMailPage(props: ViewMailProps) {
	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	const [mail, setMail] = useState<mailType>(emptyMail);

	useEffect(() => {
		getSlip(setMail, props.id, user);
	}, [mail]);

	return (
		<>
			<div>{mail.subject}</div>
			<div>{mail.content}</div>
		</>
	);
}
