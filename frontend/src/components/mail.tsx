import { useContext } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

// MailboxDisplay:
//
// Table display for the current mailbox
export default function MailboxDisplay() {
	const displayList = useContext(MailListContext) as MailListContextType;
	const navigation = useNavigate();

	// Navigation to content view of each mail entry
	const navViewMail = (id: string) => {
		navigation(`/mail/${id}`, { relative: 'path' });
	};

	return (
		<Table>
			<tbody>
				{displayList.map((mail) => (
					<tr key={mail.id} onClick={() => navViewMail(mail.id)}>
						<td>{mail.from.name}</td>
						<td>{mail.subject}</td>
						<td>{mail.preview}</td>
						<td>{mail.time}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
