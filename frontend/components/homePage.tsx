import { useState, useEffect } from 'react';
import {
	MailListContext,
	MailListContextType,
	tokenType,
} from './lib/SharedContext';
import MailDisplay from './mail';
import { callServer } from './lib/apiCom';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dropdown, Container, Navbar, Image } from 'react-bootstrap';

const getMail = (
	setList: Function,
	mailbox: string,
	user: tokenType,
) => {
	const email = user ? user.email : null;
	callServer('/mail?mailbox=' + mailbox, 'GET', null, email)
		.then((response) => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			setList(json);
		})
		.catch((err) => {
			alert(`Error retrieving emails, please try again.\n${err}`);
		});
};

const HomePage: NextPage = () => {
	const [mailbox, setMailbox] = useState('Inbox');
	const [maillist, setList] = useState<MailListContextType>([]);
	const router = useRouter();

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	useEffect(() => {
		getMail(setList, mailbox, user);
	}, [mailbox]);

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
