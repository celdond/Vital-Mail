import { Button, Container, Form, Col} from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { callServer } from './lib/apiCom';

// LoginPage:
//
// Page for users to login to the site
export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [passcode, setCode] = useState('');
	const navigation = useNavigate();

	// submitLogin:
	//
	// API call to attempt a login
	// Success moves the user to the home page
	async function submitLogin() {
		const loginInfo = { email: email, password: passcode };
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
	}

	return (
		<main className="background">
			<Container className="centerpiece">
				<Col>
					<Form>
						<Form.Group>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								value={passcode}
								onChange={(e) => setCode(e.target.value)}
							/>
						</Form.Group>
					</Form>
					<Col>
						<Button variant="primary" type="submit" onClick={submitLogin}>
							Submit
						</Button>
						<div>
							<Link to="/register">Register a new account</Link>
						</div>
					</Col>
				</Col>
			</Container>
		</main>
	);
};
