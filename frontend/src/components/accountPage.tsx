import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Col, Form, Button } from 'react-bootstrap';
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
					</div>
					<div className="mailview">
						<Form className="full">
							<Form.Group controlId="name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									name="name"
									onChange={handleChange}
									required
                                    placeholder={user.name}
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="email">
								<Form.Label>Username</Form.Label>
								<Form.Control
									name="email"
									onChange={handleChange}
									required
                                    placeholder={user.email}
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									name="password"
									onChange={handleChange}
									required
                                    placeholder="**********"
									type="password"
								/>
							</Form.Group>
                            <Button className="accountSubmit">
                                Submit
                            </Button>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
