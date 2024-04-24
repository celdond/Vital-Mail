import { Button, Container, Form, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { callServer } from './lib/apiCom';
import { ExclamationDiamondFill } from 'react-bootstrap-icons';
import { validatePassword, validateName } from './lib/validators';

// LoginPage:
//
// Page for users to login to the site
export default function LoginPage() {
	const [form, setForm] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState({
		error: 0,
		email: null,
		password: null,
		login: null,
	});

	const navigation = useNavigate();

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
	const validateForm = (email: string, password: string) => {
		const newErrors = { error: 0, email: null, password: null, login: null };

		if (email.length === 0) {
			newErrors.email = 'Enter your username';
			newErrors.error = 1;
		} else if (!validateName(email)) {
			newErrors.email = 'Username includes invalid characters.';
			newErrors.error = 1;
		}

		if (password.length === 0) {
			newErrors.password = 'Enter your password';
			newErrors.error = 1;
		} else if (!validatePassword(password)) {
			newErrors.password = 'Passcode includes invalid characters.';
			newErrors.error = 1;
		}

		return newErrors;
	};

	// submitLogin:
	//
	// API call to attempt a login
	// Success moves the user to the home page
	const submitLogin = () => {
		const loginInfo = form;
		const formErrors = validateForm(loginInfo.email, loginInfo.password);
		setErrors(formErrors);
		if (formErrors.error) {
			return;
		}
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
			.catch((e) => {
				const loginFail = { ...formErrors };
				loginFail.login = 'Login Failed.';
				setErrors(loginFail);
				console.log(e);
			});
	};

	return (
		<main className="background">
			<Container className="centerpiece">
				<img className="centerObject" src="/vitalv.png" height="150" />
				<Col>
					<Form onSubmit={(e) => e.preventDefault()}>
						<Form.Group>
							<Form.Label htmlFor="username">Username</Form.Label>
							<Form.Control
								type="text"
								id="username"
								placeholder="Username"
								onChange={(e) => setFormField('email', e.target.value)}
								isInvalid={!!errors.email}
							/>
							<Form.Control.Feedback type="invalid">
								<ExclamationDiamondFill /> {errors.email}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="password">Password</Form.Label>
							<Form.Control
								type="password"
								id="password"
								placeholder="Password"
								onChange={(e) => setFormField('password', e.target.value)}
								isInvalid={!!errors.password}
							/>
							<Form.Control.Feedback type="invalid">
								<ExclamationDiamondFill /> {errors.password}
							</Form.Control.Feedback>
						</Form.Group>
						<Col>
							<div className="customFeedback">{errors.login}</div>
							<Button
								className="fullButton"
								variant="primary"
								type="submit"
								onClick={submitLogin}
							>
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
