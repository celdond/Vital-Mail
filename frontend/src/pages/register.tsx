import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { callServer } from '../components/lib/apiCom';

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [passcode, setCode] = useState('');
	const [confirmcode, setConfirm] = useState('');
	const navigation = useNavigate();

	async function submitRegister() {
		if (passcode != confirmcode) {
			alert('Passwords do not match.');
		}
		const registerInfo = { username: name, email: email, password: passcode };
		callServer('/register', 'POST', registerInfo)
			.then((response) => {
				if (!response.ok) {
					throw response;
				}
				navigation('/login');
				return;
			})
			.catch((err) => {
				alert(`Error registering, please try again.\n${err}`);
			});
	}

	return (
		<main className="background">
			<Container className="centerpiece">
				<Form>
					<Form.Group>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="name"
							placeholder="Username"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Account Name</Form.Label>
						<Form.Control
							type="email"
							placeholder="Account Name"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							value={passcode}
							onChange={(e) => setCode(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="formBasicPassword">
						<Form.Label>Password Confirmation</Form.Label>
						<Form.Control
							type="password"
							placeholder="Confirm Password"
							value={confirmcode}
							onChange={(e) => setConfirm(e.target.value)}
						/>
					</Form.Group>
				</Form>
				<Button variant="primary" type="submit" onClick={submitRegister}>
					Register
				</Button>
			</Container>
		</main>
	);
};