import React from 'react';
import type { NextPage } from 'next';
import { Button, Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { callServer } from '../components/lib/apiCom';

const Home: NextPage = () => {
	const router = useRouter();
	const [user, setUser] = useState('');
	const [passcode, setCode] = useState('');

	async function submitLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const loginInfo = {};
		callServer('/login', 'POST', loginInfo)
			.then((response) => {
				if (!response.ok) {
					throw response;
				}
				return response.json();
			})
			.then((json) => {
				localStorage.setItem(
					`essentialMailToken/${user}`,
					JSON.stringify(json),
				);
				router.push(`/mail`);
			})
			.catch((err) => {
				alert(`Error logging in, please try again.`);
			});
	}

	return (
		<Container>
			<Form onSubmit={submitLogin}>
				<Form.Group>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Email"
						value={user}
						onChange={(e) => setUser(e.target.value)}
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
			<Button type="submit">Submit</Button>
		</Container>
	);
};

export default Home;
