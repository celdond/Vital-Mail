import { callServer } from '../lib/apiCom';
import { tokenType } from '../lib/SharedContext';

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
				console.log(response);
				throw response;
			}
			return response.json();
		})
		.then(() => {
			alert('Success!');
		})
		.catch((err) => {
			alert(`Error moving message, please try again.\n${err}`);
			console.log(err);
		});
};
