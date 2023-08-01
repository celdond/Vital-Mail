import type { NextPage } from 'next';
import { Button, Container, Form } from 'react-bootstrap';
import { useState } from 'react';

const Home: NextPage = () => {
    const [user, setUser] = useState({email: '', password: ''});
    
	return (
		<Container>
			<Form>
				<Form.Group>
					<Form.Label>Email Address</Form.Label>
					<Form.Control type="email" placeholder="Email" />
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" />
				</Form.Group>
			</Form>
			<Button type="submit">Submit</Button>
		</Container>
	);
};

export default Home;
