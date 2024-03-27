import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { callServer } from '../components/lib/apiCom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { validatePassword, validateName } from './lib/validators';

// RegisterPage:
//
// Page for creating a new account
export default function RegisterPage() {
	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
		confirmcode: '',
	});
	const navigation = useNavigate();

	const [errors, setErrors] = useState({
		error: 0,
		username: null,
		email: null,
		password: null,
		confirmcode: null,
		register: null,
	});

	// setFormField
	//
	// Function to alter fields as entered
	// field	- field in form being changed
	// value	- value to make field
	const setFormField = (field: string, value: string) => {
		const newForm = { ...form };
		newForm[field] = value;
		setForm(newForm);

		if (!!errors[field]) {
			const newErrors = { ...errors };
			newErrors[field] = null;
			setErrors(newErrors);
		}
	};

	// validateForm
	//
	// Function to check credentials for validity
	const validateForm = () => {
		const newErrors = {
			error: 0,
			email: null,
			username: null,
			password: null,
			login: null,
			confirmcode: null,
			register: null,
		};

		if (form.email.length === 0) {
			newErrors.email = 'Enter your username';
			newErrors.error = 1;
		} else if (!validateName(form.email)) {
			newErrors.email = 'Username includes invalid characters.';
			newErrors.error = 1;
		}

		if (form.username.length === 0) {
			newErrors.email = 'Enter your name';
			newErrors.error = 1;
		} else if (!validateName(form.email)) {
			newErrors.email = 'Name includes invalid characters.';
			newErrors.error = 1;
		}

		if (form.password.length === 0) {
			newErrors.password = 'Enter your password';
			newErrors.error = 1;
		} else if (!validatePassword(form.password)) {
			newErrors.password = 'Passcode includes invalid characters.';
			newErrors.error = 1;
		}

		return newErrors;
	};

	// submitRegister:
	//
	// API call to register a new account
	async function submitRegister() {
		if (form.password != form.confirmcode) {
			alert('Passwords do not match.');
			return;
		}

		const formErrors = validateForm();
		setErrors(formErrors);

		if (!errors.error) {
			return;
		}

		const registerInfo = {
			username: form.username,
			email: form.email,
			password: form.password,
		};
		callServer('/register', 'POST', registerInfo)
			.then((response) => {
				if (!response.ok) {
					throw response;
				}
				navigation('/');
				return;
			})
			.catch((err) => {
				console.log(err);
				switch (err.status) {
					default:
						alert(`Error registering, please try again.\n${err}`);
				}
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
								value={form.username}
								onChange={(e) => setFormField('username', e.target.value)}
							/>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-name`}>
										Limited to only alphanumeric characters: a-z, 0-9, and _
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
								value={form.email}
								onChange={(e) => setFormField('email', e.target.value)}
							/>
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={`tooltip-username`}>
										Must be unique! Alphanumeric and special characters !?#$%&_
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
									value={form.password}
									onChange={(e) => setFormField('password', e.target.value)}
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
								value={form.confirmcode}
								onChange={(e) => setFormField('confirmcode', e.target.value)}
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
