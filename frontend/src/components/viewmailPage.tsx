import { tokenType, mailType } from './lib/SharedContext';
import { callServer } from './lib/apiCom';
import { useState, useEffect } from 'react';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { Container, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
	const navigation = useNavigate();

	const [mail, setMail] = useState<mailType>(emptyMail);

	useEffect(() => {
		getSlip(setMail, props.id, user);
	}, [props.id]);

	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col>
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
					</div>
					<div className="mailview">
						<h1>{mail.subject}</h1>
						<Row xs="auto">
							<Col>
								<span className="bold">{mail.from.name}</span>
							</Col>
							<Col>
								<span>{mail.from.email}</span>
							</Col>
							<Col>
								<span>{mail.timestamp}</span>
							</Col>
						</Row>
						<hr />
						<div className="content">
							<p>{mail.content}</p>
						</div>
					</div>
				</Col>
			</Container>
		</main>
	);
}
