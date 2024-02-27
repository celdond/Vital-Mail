import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { callServer } from '../components/lib/apiCom';

// RegisterPage:
//
// Page for creating a new account
export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [passcode, setCode] = useState('');
	const [confirmcode, setConfirm] = useState('');
	const navigation = useNavigate();

	// submitRegister:
	//
	// API call to register a new account
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
				navigation('/');
				return;
			})
			.catch((err) => {
				alert(`Error registering, please try again.\n${err}`);
			});
	}

	return (
		<main className="background">
			<Container className="centerpiece centerpadding">
				<h1>Create Account</h1>
				<Form>
					<Form.Group className="field-wrapper">
						<Form.Label>Name</Form.Label>
						<InputGroup>
							<Form.Control
								type="name"
								placeholder="Name"
								aria-describedby="basic-addon2"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<InputGroup.Text id="basic-addon2">?</InputGroup.Text>
						</InputGroup>
					</Form.Group>
					<Form.Group className="field-wrapper">
						<Form.Label>Username</Form.Label>
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="Username"
								aria-describedby="basic-addon2"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<InputGroup.Text id="basic-addon2">?</InputGroup.Text>
						</InputGroup>
					</Form.Group>
					<div className="field-wrapper">
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
							<Form.Control
								type="password"
								placeholder="Confirm Password"
								value={confirmcode}
								onChange={(e) => setConfirm(e.target.value)}
							/>
						</Form.Group>
					</div>
				</Form>
				<Button variant="primary" type="submit" onClick={submitRegister}>
					Register
				</Button>
			</Container>
		</main>
	);
}
