import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Col, Form, Button } from 'react-bootstrap';
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
const deleteAccount = (user: tokenType) => {
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
			alert('Success!');
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

	const user = JSON.parse(account);
	const navigation = useNavigate();
	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col className="full">
					<div className="simpleBar">
						<BoxArrowLeft onClick={() => navigation(-1)} />
					</div>
					<div className="mailview">
						<Form className="full">
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
							<Button
								className="accountSubmit"
								onClick={() => deleteAccount(user)}
							>
								Delete Account
							</Button>
						</Form>
					</div>
				</Col>
			</Container>
		</main>
	);
}
