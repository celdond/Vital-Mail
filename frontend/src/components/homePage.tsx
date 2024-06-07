import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailListContext, tokenType } from './lib/SharedContext';
import { timeSet } from './lib/timeConvert';
import MailboxDisplay from './mail';
import { callServer } from './lib/apiCom';
import {
	Container,
	Navbar,
	Offcanvas,
	Row,
	Col,
	Modal,
	Form,
	Button,
	InputGroup,
} from 'react-bootstrap';
import {
	InboxFill,
	Inbox,
	Trash,
	PencilSquare,
	Search,
} from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';
import { getBoxes, postBox, deleteBox } from './lib/slipFunctions';

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
	query: string,
	page: number,
) => {
	let endpoint = '/mail?mailbox=' + mailbox;
	if (query) {
		endpoint += '&query=' + query;
	}
	if (page && page != 0) {
		endpoint += '&page=' + page;
	}
	const token = user ? user.token : null;
	callServer(endpoint, 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			const organizedList = timeSet(json);
			if (!query) {
				setQuery({ box: mailbox });
			} else {
				setQuery({});
			}
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
	for (const box of boxes) {
		if (!(box === 'Sent' || box === 'Trash' || box === 'Inbox')) {
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

	const [page, pageFunction] = useState(0);
	const [update, updateFunction] = useState(false);
	const [boxes, setBoxes] = useState([]);
	const [customBoxes, setCustomBoxes] = useState<string[]>([]);
	const [mailbox, setMailbox] = useState(box ?? 'Inbox');
	const [maillist, setList] = useState([emptyMail]);
	const [newBox, setBoxName] = useState('');
	const [removeBox, setRemoveBox] = useState('');
	const [search, setSearch] = useState('');
	const navigation = useNavigate();

	const [showPostBox, setPostBox] = useState(false);
	const handleBoxClose = () => setPostBox(false);
	const handleBoxShow = () => setPostBox(true);

	const [showDeleteBox, setDeleteBox] = useState(false);
	const handleDeleteBoxClose = () => setDeleteBox(false);
	const handleDeleteBoxShow = () => setDeleteBox(true);

	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);

	useEffect(() => {
		pageFunction(0);
		setSearch('');
		getMail(setList, setSearchParams, mailbox, user, null, 0);
	}, [mailbox]);

	useEffect(() => {
		setSearch('');
		getMail(setList, setSearchParams, mailbox, user, null, page);
	}, [update, page]);

	useEffect(() => {
		getBoxes(setBoxes, user).then((json) => {
			parseBoxes(setCustomBoxes, json);
		});
	}, []);

	const logout = () => {
		localStorage.removeItem(`essentialMailToken`);
		setList([]);
		navigation('/');
	};

	const handleBoxNameChange = (event: any) => {
		const { value } = event.target;
		setBoxName(value);
	};

	const handleBoxSwap = (box: string) => {
		if (mailbox === box) {
			updateFunction(!update);
		} else {
			setMailbox(box);
		}
	};

	const handleDeleteBox = () => {
		const targetCustomBox = removeBox;
		deleteBox(user, targetCustomBox).then((success) => {
			if (success == 0) {
				const newCustomBoxes = customBoxes.filter((e) => e !== removeBox);
				const newBoxes = boxes.filter((e) => e !== removeBox);
				setCustomBoxes(newCustomBoxes);
				setBoxes(newBoxes);
				if (mailbox === removeBox) {
					setMailbox('Inbox');
				}
				handleDeleteBoxClose();
			}
		});
	};

	const handleCreateBox = () => {
		const newCustomBox = newBox;
		postBox(user, newCustomBox).then((success) => {
			if (success == 0) {
				const newCustomBoxes = customBoxes;
				const newBoxes = boxes;
				newCustomBoxes.push(newCustomBox);
				newBoxes.push(newCustomBox);
				setCustomBoxes(newCustomBoxes);
				setBoxes(newBoxes);
				handleBoxClose();
			}
		});
	};

	const handleQueryChange = (event: any) => {
		const { value } = event.target;
		setSearch(value);
	};

	const mailboxNav = (
		<Container>
			<hr />
			<Row xs="auto" onClick={() => handleBoxSwap('Inbox')}>
				<Col>
					<InboxFill />
				</Col>
				<Col>Inbox</Col>
			</Row>
			<Row xs="auto" onClick={() => handleBoxSwap('Sent')}>
				<Col>
					<Inbox />
				</Col>
				<Col>Sent</Col>
			</Row>
			<Row xs="auto" onClick={() => handleBoxSwap('Trash')}>
				<Col>
					<Trash />
				</Col>
				<Col>Trash</Col>
			</Row>
			<hr />
			<Row xs="auto">
				<Col> Custom Boxes</Col>
				<Col onClick={handleBoxShow}> +</Col>
				<Col onClick={handleDeleteBoxShow}> -</Col>
			</Row>
			{customBoxes.map((box) => (
				<Row onClick={() => handleBoxSwap(box)}>
					<Col> {box}</Col>
				</Row>
			))}
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
		<>
			<div className="backplate">
				<Navbar className="navbar" expand={'false'}>
					<Container className="nomargin">
						<Row xs="auto" className="alignCenter">
							<Col>
								<Container className="d-lg-none" fluid>
									<Navbar.Toggle aria-controls="menu" />
									<Navbar.Offcanvas
										backdrop={false}
										id="menu"
										aria-labelledby="menu"
										variant="primary"
									>
										<Offcanvas.Header className="headerCanvas" closeButton>
												<img
													className="centerObject"
													src="/vitalv.png"
													height="40"
												/>
										</Offcanvas.Header>
										<Offcanvas.Body>{mailboxNav}</Offcanvas.Body>
									</Navbar.Offcanvas>
								</Container>
							</Col>
							<Col>
								<PencilSquare
									className="emblemSpacing"
									width="40"
									height="40"
									onClick={() => navigation('/compose')}
								/>
							</Col>
							<Col className="searchField">
								<InputGroup>
									<InputGroup.Text id="basic-addon1">
										<Search
											className="emblemSpacing"
											width="25"
											height="25"
											onClick={() =>
												getMail(
													setList,
													setSearchParams,
													mailbox,
													user,
													search,
													page,
												)
											}
										/>
									</InputGroup.Text>
									<Form.Control
										type="text"
										onChange={handleQueryChange}
										value={search}
									/>
								</InputGroup>
							</Col>
						</Row>
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
								page: page,
							}}
						>
							<MailboxDisplay
								updateFunction={updateFunction}
								pageFunction={pageFunction}
							/>
						</MailListContext.Provider>
					</div>
				</div>
			</div>

			<Modal show={showPostBox} onHide={handleBoxClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Mailbox</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Mailbox Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="mailbox"
								onChange={handleBoxNameChange}
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleBoxClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleCreateBox}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showDeleteBox} onHide={handleDeleteBoxClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Mailbox</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Select
							value={removeBox}
							onChange={(e: any) => setRemoveBox(e.currentTarget.value)}
						>
							<option>Select a Mailbox</option>
							{customBoxes.map((box) => (
								<option value={box}>{box}</option>
							))}
						</Form.Select>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleDeleteBoxClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleDeleteBox}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
