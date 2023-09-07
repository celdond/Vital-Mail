import { tokenType } from './lib/SharedContext';
import { Container, Col, Form, Button } from 'react-bootstrap';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { callServer } from './lib/apiCom';

const sendMail = (event: any, navigation: Function, user: tokenType) => {
	const token = user ? user.token : null;
	console.log(event);
	callServer('/mail', 'POST', event, token)
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
	const user = JSON.parse(account);
	const navigation = useNavigate();

	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col>
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
					</div>
					<div className="mailview">
						<Form onSubmit={(e) => sendMail(e, navigation, user)}>
							<Button type="submit">Send</Button>
							<Form.Group controlId="address">
								<Form.Label>Address</Form.Label>
								<Form.Control required type="text" />
							</Form.Group>
							<Form.Group controlId="subject">
								<Form.Label>Subject</Form.Label>
								<Form.Control required type="text" />
							</Form.Group>
							<Form.Group controlId="content">
								<Form.Label>Message</Form.Label>
								<Form.Control as="textarea" rows={5} />
							</Form.Group>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
