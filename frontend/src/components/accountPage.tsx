import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Col, Form } from 'react-bootstrap';
import { BoxArrowLeft } from 'react-bootstrap-icons';

export default function AccountPage() {
	const account = localStorage.getItem(`essentialMailToken`);
	const [changes, setChanges] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleChange = (event: any) => {
		const { value, name } = event.target;
		const u = changes;
		u[name] = value;
		setChanges(u);
	};

	const user = JSON.parse(account);
	const navigation = useNavigate();
	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col className="full">
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
						<BoxArrowLeft />
					</div>
					<div className="mailview">
						<Form className="full">
							<Form.Group controlId="name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									name="name"
									onChange={handleChange}
									required
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									name="email"
									onChange={handleChange}
									required
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									name="password"
									onChange={handleChange}
									required
									type="password"
								/>
							</Form.Group>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
