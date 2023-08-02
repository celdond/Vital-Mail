import React from 'react';
import type { NextPage } from 'next';
import { Button, Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { callServer } from '../components/lib/apiCom';

const Login: NextPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [passcode, setCode] = useState('');

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
				localStorage.setItem(
					`essentialMailToken/${email}`,
					JSON.stringify(json),
				);
				router.push(`/mail/home`);
			})
			.catch((err) => {
				alert(`Error logging in, please try again.`);
			});
	}

	return (
		<Container>
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
			<Button variant="primary" type="submit" onClick={submitLogin}>
				Submit
			</Button>
		</Container>
	);
};

export default Login;
