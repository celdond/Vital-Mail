import React from 'react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form } from 'react-bootstrap';

const Register: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
	const [passcode, setCode] = useState('');

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
        </Container>
    );
};

export default Register;
