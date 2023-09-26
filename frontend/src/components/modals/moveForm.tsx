import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { callServer } from '../lib/apiCom';
import { tokenType } from '../lib/SharedContext';

// moveSlip:
//
// API call to request the current message is moved to target mailbox
//
// mailbox	- target mailbox to move to
// id		- Message id to retrieve from server
// user		- user field for verification
const moveSlip = (mailbox: string, id: string[], user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mail?mailbox=' + mailbox, 'PUT', id, token)
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				throw response;
			}
			return response.json();
		})
		.then(() => {
			alert("Success!");
		})
		.catch((err) => {
			alert(`Error moving message, please try again.\n${err}`);
			console.log(err);
		});
};

export function moveFormModal(ids: string[], activate: boolean, close: any) {
	return (
		<>
			<Modal show={activate} onHide={close}>
				<Modal.Header closeButton>
					<Modal.Title>Move Message?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Mailbox</Form.Label>
							<Form.Control
								type="email"
								placeholder="name@example.com"
								autoFocus
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={close}>
						Close
					</Button>
					<Button variant="primary" onClick={close}>
						Move
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
