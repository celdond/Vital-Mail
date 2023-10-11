import { callServer } from './apiCom';
import { tokenType } from './SharedContext';

// moveSlip:
//
// API call to request the current message is moved to target mailbox
//
// mailbox	- target mailbox to move to
// id		- Message id to retrieve from server
// user		- user field for verification
export const moveSlip = (mailbox: string, id: string[], user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mail?mailbox=' + mailbox, 'PUT', id, token)
		.then((response) => {
			if (!response.ok) {
				throw response;
			}
			return;
		})
		.then(() => {
			alert('Success!');
		})
		.catch((err) => {
			alert(`Error moving message, please try again.\n${err}`);
			console.log(err);
		});
};

// getSlip:
//
// API call to retrieve mail content to display
//
// setMail 	- Function to change the state of the mail content
// id		- Message id to retrieve from server
// user		- user field for verification
export const getSlip = (setMail: Function, id: string, user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mail/' + id, 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			setMail(json);
		})
		.catch((err) => {
			alert(`Error retrieving message, please try again.\n${err}`);
			console.log(err);
		});
};

// getBoxes:
//
// API call to retrieve mail boxes
//
// setBoxes	- Function to change the state of the mailbox content
// user		- user field for verification
export const getBoxes = (setBoxes: Function, user: tokenType) => {
	const token = user ? user.token : null;
	callServer('/mailbox', 'GET', null, token)
		.then((response) => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		})
		.then((json) => {
			setBoxes(json);
		})
		.catch((err) => {
			alert(`Error retrieving message, please try again.\n${err}`);
			console.log(err);
		});
};

// postBox:
//
// API call to create a new custom mailbox
//
// user		- user field for verification
// newBox	- name of the new mailbox
export const postBox = (user: tokenType, newBox: string) => {
	const token = user ? user.token : null;
	const success = callServer('/mailbox', 'POST', {newBox: newBox}, token)
		.then((response) => {
			if (!response.ok) {
				throw response;
			}
			return;
		})
		.then(() => {
			alert(`Success!`);
			return 0;
		})
		.catch((err) => {
			alert(`${err}`);
			console.log(err);
			return -1;
		});
	return success;
};
