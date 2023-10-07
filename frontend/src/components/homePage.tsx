import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailListContext, tokenType } from './lib/SharedContext';
import { timeSet } from './lib/timeConvert';
import MailboxDisplay from './mail';
import { callServer } from './lib/apiCom';
import { Container, Navbar, Offcanvas, Row, Col } from 'react-bootstrap';
import { InboxFill, Inbox, Trash, PencilSquare } from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';
import { getBoxes } from './lib/slipFunctions';

// getMail:
//
// API call to retrieve mailbox contents
//
// setList 	- set the mailbox contents to display
// setQuery - sets the query in the search bar for history sake
// mailbox 	- name of the desired mailbox to retrieve
// user		- user token for verification
const getMail = (
	setList: Function,
	setQuery: Function,
	mailbox: string,
	user: tokenType,
) => {
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
			setQuery({ box: mailbox });
			setList(organizedList);
		})
		.catch((err) => {
			alert(`Error retrieving emails, please try again.\n${err}`);
		});
};

// parseBoxes:
//
// parses boxes to find custom boxes
//
// setList	- function to set the state of the custom mailboxes
// boxes	- mailboxes to parse
const parseBoxes = (setList: Function, boxes: string[]) => {
	const newCustomBoxList: string[] = [];
	for (const box in boxes) {
		if (!(box === "Sent" || box === "Trash" || box === "Inbox")) {
			newCustomBoxList.push(box);
		}
	}
	setList(newCustomBoxList);
};

const emptyMail = {
	id: '',
	from: {
		name: '',
	},
	subject: '',
	preview: '',
	time: '',
	timestamp: '',
	dateValue: new Date(),
};

// HomePage:
//
// Dashboard page to access account contents and information
export default function HomePage() {
	const [searchParams, setSearchParams] = useSearchParams();
	let box = searchParams.get('box');

	const [update, updateFunction] = useState(false);
	const [boxes, setBoxes] = useState([]);
	const [customBoxes, setCustomBoxes] = useState([]);
	const [mailbox, setMailbox] = useState(box ?? 'Inbox');
	const [maillist, setList] = useState([emptyMail]);
	const navigation = useNavigate();

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	useEffect(() => {
		getMail(setList, setSearchParams, mailbox, user);
	}, [mailbox, update]);

	useEffect(() => {
		getBoxes(setBoxes, user);
	}, []);

	const logout = () => {
		localStorage.removeItem(`essentialMailToken`);
		setList([]);
		navigation('/');
	};

	const mailboxNav = (
		<Container>
			<hr />
			<Row xs="auto" onClick={() => setMailbox('Inbox')}>
				<Col>
					<InboxFill />
				</Col>
				<Col>Inbox</Col>
			</Row>
			<Row xs="auto" onClick={() => setMailbox('Sent')}>
				<Col>
					<Inbox />
				</Col>
				<Col>Sent</Col>
			</Row>
			<Row xs="auto" onClick={() => setMailbox('Trash')}>
				<Col>
					<Trash />
				</Col>
				<Col>Trash</Col>
			</Row>
			<hr />
			<Row onClick={() => navigation('/account')}>
				<div> Account</div>
			</Row>
			<Row onClick={logout}>
				<div> Logout</div>
			</Row>
		</Container>
	);

	return (
		<div className="backplate">
			<Navbar className="navbar" expand={'false'}>
				<Container className="nomargin">
					<Col xs="auto">
						<Container className="d-lg-none" fluid>
							<Navbar.Toggle aria-controls="menu" />
							<Navbar.Offcanvas
								backdrop={false}
								id="menu"
								aria-labelledby="menu"
								variant="primary"
							>
								<Offcanvas.Header closeButton>
									<Offcanvas.Title id="menu">V</Offcanvas.Title>
								</Offcanvas.Header>
								<Offcanvas.Body>{mailboxNav}</Offcanvas.Body>
							</Navbar.Offcanvas>
						</Container>
					</Col>
					<Col className="colSpacing">
						<PencilSquare
							className="emblemSpacing"
							width="40"
							height="40"
							onClick={() => navigation('/compose')}
						/>
					</Col>
				</Container>
			</Navbar>
			<div className="dashboard">
				<Container className="mailNav d-none d-lg-block">
					{mailboxNav}
				</Container>
				<div className="mailplate">
					<MailListContext.Provider
						value={{
							mail: maillist,
							mailbox: boxes,
							user: user,
							update: update,
						}}
					>
						<MailboxDisplay updateFunction={updateFunction} />
					</MailListContext.Provider>
				</div>
			</div>
		</div>
	);
}
