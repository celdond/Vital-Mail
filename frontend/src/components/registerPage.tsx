import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { callServer } from '../components/lib/apiCom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

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
						<InputGroup>
							<Form.Control
								type="name"
								placeholder="Name"
								aria-describedby="basic-addon2"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-name`}>
										Limited to only alphanumeric characters: a-z and 0-9
									</Tooltip>
								}
							>
								<InputGroup.Text id="basic-addon2">?</InputGroup.Text>
							</OverlayTrigger>
						</InputGroup>
					</Form.Group>
					<Form.Group className="field-wrapper">
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="Username"
								aria-describedby="basic-addon2"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-username`}>
										Must be unique, we will tell you if it is not
									</Tooltip>
								}
							>
								<InputGroup.Text id="basic-addon2">?</InputGroup.Text>
							</OverlayTrigger>
						</InputGroup>
					</Form.Group>
					<div className="field-wrapper">
						<Form.Group controlId="formBasicPassword">
							<InputGroup>
								<Form.Control
									type="password"
									placeholder="Password"
									value={passcode}
									onChange={(e) => setCode(e.target.value)}
								/>
								<OverlayTrigger
									placement="top"
									overlay={
										<Tooltip id={`tooltip-password`}>
											Must be at least 8 characters long
										</Tooltip>
									}
								>
									<InputGroup.Text id="basic-addon2">?</InputGroup.Text>
								</OverlayTrigger>
							</InputGroup>
						</Form.Group>
						<div className="field-wrapper" />
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
