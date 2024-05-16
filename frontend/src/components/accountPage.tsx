import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useState } from 'react';
import { Container, Col, Form, Button, Modal } from 'react-bootstrap';
import { callServer } from './lib/apiCom';
import { tokenType } from './lib/SharedContext';
import { BoxArrowLeft } from 'react-bootstrap-icons';

// sendMail:
//
// Function to send desired changes to API
//
// changes	- desired changes in a JSON object
// user		- user desiring changes to their account
const sendChanges = (changes: any, user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/account', 'POST', changes, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return;
		})
		.then(() => {
			alert('Success!');
		})
		.catch((err) => {
			alert(`(${err}), please try again`);
		});
};

// deleteAccount:
//
// Function to send request to delete account
//
// user		- user desiring deletion of their account
const deleteAccount = (user: tokenType, nav: NavigateFunction) => {
	const token = user ? user.token : null;
	callServer('/account', 'DELETE', null, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return;
		})
		.then(() => {
			nav('/');
		})
		.catch((err) => {
			alert(`(${err}), please try again`);
		});
};

// AccountPage:
//
// Page for updating account information
export default function AccountPage() {
	const account = localStorage.getItem(`essentialMailToken`);
	const [changes, setChanges] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleChange = (event: any) => {
		const { value, name } = event.target;
		const u = changes;
		u[name] = value;
		setChanges(u);
	};

	const [showDeleteBox, setDeleteBox] = useState(false);
	const handleClose = () => setDeleteBox(false);
	const handleOpen = () => setDeleteBox(true);

	const user = JSON.parse(account);
	const navigation = useNavigate();
	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col className="full">
					<div className="simpleBar">
						<Button className="simpleBarButton">
							<BoxArrowLeft size={28} onClick={() => navigation(-1)} />
						</Button>
					</div>
					<div className="mailview">
						<Form className="full">
							<h2>Change Account</h2>
							<Form.Group controlId="name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									name="name"
									onChange={handleChange}
									required
									placeholder={user.name}
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="email">
								<Form.Label>Username</Form.Label>
								<Form.Control
									name="email"
									onChange={handleChange}
									required
									placeholder={user.email}
									type="text"
								/>
							</Form.Group>
							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									name="password"
									onChange={handleChange}
									required
									placeholder="**********"
									type="password"
								/>
							</Form.Group>
							<Button
								className="accountSubmit"
								onClick={() => sendChanges(changes, user)}
							>
								Submit
							</Button>
							<hr />
							<h2>Delete Account</h2>
							<Button className="accountSubmit" onClick={handleOpen}>
								Delete Account
							</Button>
						</Form>
					</div>
				</Col>
			</Container>

			<Modal show={showDeleteBox} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Account</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to delete your account?</p>
					<p>This is PERMANENT.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={() => deleteAccount(user, navigation)}
					>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</main>
	);
}
