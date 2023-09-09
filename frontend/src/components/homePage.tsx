import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	MailListContext,
	MailListContextType,
	tokenType,
} from './lib/SharedContext';
import { timeSet } from './lib/timeConvert';
import MailDisplay from './mail';
import { callServer } from './lib/apiCom';
import { Container, Navbar, Offcanvas, Row, Col } from 'react-bootstrap';
import { InboxFill, Inbox, Trash, PencilSquare } from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';

// getMail:
//
// API call to retrieve mailbox contents
//
// setList 	- set the mailbox contents to display
// setQuery - sets the query in the search bar for history sake
// mailbox 	- name of the desired mailbox to retrieve
// user		- user token for verification
const getMail = (setList: Function, setQuery: Function, mailbox: string, user: tokenType) => {
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
			const organizedList = timeSet(json);
			setQuery({box: mailbox});
			setList(organizedList);
		})
		.catch((err) => {
			alert(`Error retrieving emails, please try again.\n${err}`);
		});
};

// HomePage:
//
// Dashboard page to access account contents and information
export default function HomePage() {
	const [searchParams, setSearchParams] = useSearchParams();
	let box = searchParams.get("box");

	const [mailbox, setMailbox] = useState(box ?? 'Inbox');
	const [maillist, setList] = useState<MailListContextType>([]);
	const navigation = useNavigate();

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	useEffect(() => {
		getMail(setList, setSearchParams, mailbox, user);
	}, [mailbox]);

	const logout = () => {
		localStorage.removeItem(`essentialMailToken`);
		setList([]);
		navigation('/');
	};

	return (
		<div className="backplate">
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
								<Row xs="auto" onClick={() => navigation('/compose')}>
									<Col>
										<PencilSquare />
									</Col>
									<Col>Compose</Col>
								</Row>
								<hr />
								<Row xs="auto" onClick={() => setMailbox("Inbox")}>
									<Col>
										<InboxFill />
									</Col>
									<Col>Inbox</Col>
								</Row>
								<Row xs="auto" onClick={() => setMailbox("Sent")}>
									<Col>
										<Inbox />
									</Col>
									<Col>Sent</Col>
								</Row>
								<Row xs="auto" onClick={() => setMailbox("Trash")}>
									<Col>
										<Trash />
									</Col>
									<Col>Trash</Col>
								</Row>
								<hr />
								<Row>
									<div> Account</div>
								</Row>
								<Row onClick={logout}>
									<div> Logout</div>
								</Row>
							</Container>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
			<div className="mailplate">
				<MailListContext.Provider value={maillist}>
					<MailDisplay />
				</MailListContext.Provider>
			</div>
		</div>
	);
};
