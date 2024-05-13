import { tokenType } from './lib/SharedContext';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { BoxArrowLeft, EnvelopeFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { callServer } from './lib/apiCom';
import { useState } from 'react';

// sendMail:
//
// API Call to send a message
// Navigates back to the previous page if successful
// Alerts the user if unsuccessful
const sendMail = (message: any, navigation: Function, user: tokenType) => {
	const token = user ? user.token : null;
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

// ComposePage
//
// Page contents for the compose functionality
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
				<Col className="full">
					<div className="simpleBar">
						<Button className="simpleBarButton">
							<BoxArrowLeft size={28} onClick={() => navigation('/mail')} />
						</Button>
						<Button className="simpleBarButton">
							<EnvelopeFill
								size={28}
								onClick={() => sendMail(message, navigation, user)}
							/>
						</Button>
					</div>
					<div className="mailview">
						<Form className="full">
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
							<Form.Group className="textcontainer" controlId="content">
								<Form.Label>Message</Form.Label>
								<Form.Control
									name="content"
									onChange={handleChange}
									as="textarea"
									className="textcontent"
								/>
							</Form.Group>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
