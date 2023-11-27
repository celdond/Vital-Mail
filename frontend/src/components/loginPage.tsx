import { Button, Container, Form, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { callServer } from './lib/apiCom';

// LoginPage:
//
// Page for users to login to the site
export default function LoginPage() {
	const [form, setForm] = useState({ email: '', passcode: '' });
	const [validated, setValidated] = useState(false);
	const [errors, setErrors] = useState({ email: '', passcode: '' });

	const navigation = useNavigate();

	// setFormField
	//
	// Function to alter fields as entered
	// field	- field in form being changed
	// value	- value to make field
	const setFormField = (field: string, value: string) => {
		const newForm = form;
		newForm[field] = value;
		setForm(newForm);

		if (!!errors[field]) {
			const newErrors = errors;
			newErrors[field] = '';
			setErrors(newErrors);
		}
	};

	// submitLogin:
	//
	// API call to attempt a login
	// Success moves the user to the home page
	const submitLogin = () => {
		const loginInfo = form;
		callServer('/login', 'POST', loginInfo)
			.then((response) => {
				if (!response.ok) {
					throw response;
				}
				return response.json();
			})
			.then((json) => {
				localStorage.setItem(`essentialMailToken`, JSON.stringify(json));
				navigation('/mail');
			})
			.catch(() => {
				alert(`Error logging in, please try again.`);
			});
	};

	return (
		<main className="background">
			<Container className="centerpiece">
				<img className="centerObject" src="/vitalv.png" height="150" />
				<Col>
					<Form
						noValidate
						validated={validated}
						onSubmit={(e) => e.preventDefault()}
					>
						<Form.Group>
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Username"
								value={form.email}
								onChange={(e) => setFormField('email', e.target.value)}
								required
							/>
							<Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								value={form.passcode}
								onChange={(e) => setFormField('passcode', e.target.value)}
							/>
							<Form.Control.Feedback type="invalid">{}</Form.Control.Feedback>
						</Form.Group>
						<Col>
							<Button variant="primary" type="submit" onClick={submitLogin}>
								Submit
							</Button>
							<div>
								<Link to="/register">Register a new account</Link>
							</div>
						</Col>
					</Form>
				</Col>
			</Container>
		</main>
	);
}
