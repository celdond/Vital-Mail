import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dropdown, Container, Navbar, Image } from 'react-bootstrap';

const Home: NextPage = () => {
	const router = useRouter();

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	const logout = () => {
		localStorage.removeItem(`essentialMailToken`);
		router.push('/');
	};

	return (
		<Container>
			<Navbar>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						<Image alt="A" roundedCircle={true} />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onclick={logout}>Logout</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar>
			<Container>Hello!</Container>
		</Container>
	);
};

export default Home;
