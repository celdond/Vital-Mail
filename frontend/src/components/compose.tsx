import { Container, Col, Form } from 'react-bootstrap';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function ComposePage() {
	const navigation = useNavigate();
	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col>
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
					</div>
					<div className="mailview">
						<Form>
							<Form.Group controlId="address">
								<Form.Label>Address</Form.Label>
								<Form.Control type="text" placeholder="Username" />
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
