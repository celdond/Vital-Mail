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
import { Container, Navbar, Offcanvas, Row, Col } from 'react-bootstrap';
import { InboxFill, Inbox, Trash } from 'react-bootstrap-icons';

const getMail = (setList: Function, mailbox: string, user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mail?mailbox=' + mailbox, 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
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
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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
		<main className="backplate">
			<Navbar className="navbar" expand={false}>
				<Container fluid>
					<Navbar.Toggle aria-controls="menu" />
					<Navbar.Offcanvas
						backdrop={false}
						id="menu"
						aria-labelledby="menu"
						placement="start"
						variant="primary"
					>
						<Offcanvas.Header closeButton>
							<Offcanvas.Title id="menu">V</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<Container>
								<Row>
									<Col>
										<InboxFill />
									</Col>
									<Col>Inbox</Col>
								</Row>
								<Row>
									<Col>
										<Inbox />
									</Col>
									<Col>Sent</Col>
								</Row>
								<Row>
									<Col>
										<Trash />
									</Col>
									<Col>Trash</Col>
								</Row>
								<Row onClick={logout}>
									<div> Logout</div>
								</Row>
							</Container>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
			<Container className="mailplate">
				<MailListContext.Provider value={maillist}>
					<MailDisplay />
				</MailListContext.Provider>
			</Container>
		</main>
	);
};

export default HomePage;
