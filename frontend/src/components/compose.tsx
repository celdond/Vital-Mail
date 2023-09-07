import { tokenType } from './lib/SharedContext';
import { Container, Col, Form } from 'react-bootstrap';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { callServer } from './lib/apiCom';
import { useState } from 'react';

const sendMail = (message: any, navigation: Function, user: tokenType) => {
	const token = user ? user.token : null;
	console.log(message);
	callServer('/mail', 'POST', message, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return;
		})
		.then(() => {
			navigation(-1);
		})
		.catch((err) => {
			alert(`(${err}), please try again`);
		});
};

export default function ComposePage() {
	const account = localStorage.getItem(`essentialMailToken`);
	const [message, setMessage] = useState({
		to: '',
		subject: '',
		content: '',
	});
	const user = JSON.parse(account);
	const navigation = useNavigate();

	const handleChange = (event: any) => {
		const { value, name } = event.target;
		const u = message;
		u[name] = value;
		setMessage(u);
	};

	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col>
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
						<BoxArrowLeft onClick={() => sendMail(message, navigation, user)} />
					</div>
					<div className="mailview">
						<Form>
							<Form.Group controlId="to">
								<Form.Label>Address</Form.Label>
								<Form.Control
									name="to"
									onChange={handleChange}
									required
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="subject">
								<Form.Label>Subject</Form.Label>
								<Form.Control
									name="subject"
									onChange={handleChange}
									required
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="content">
								<Form.Label>Message</Form.Label>
								<Form.Control
									name="content"
									onChange={handleChange}
									as="textarea"
									rows={5}
								/>
							</Form.Group>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
