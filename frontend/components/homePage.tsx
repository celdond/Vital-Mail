import { useState, useContext } from 'react';
import { MailListContext, MailListContextType } from './lib/SharedContext';
import MailDisplay from './mail';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dropdown, Container, Navbar, Image } from 'react-bootstrap';

const HomePage: NextPage = () => {
	const [mailbox, setMailbox] = useState('Inbox');
	const [maillist, setList] = useState<MailListContextType>([]);
	const router = useRouter();

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	const logout = () => {
		localStorage.removeItem(`essentialMailToken`);
		setList([]);
		router.push('/');
	};

	return (
		<Container fluid>
			<Navbar>
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						<Image alt="A" roundedCircle={true} />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar>
			<Container>
				<MailListContext.Provider value={[]}>
					<MailDisplay />
				</MailListContext.Provider>
			</Container>
		</Container>
	);
};

export default HomePage;
