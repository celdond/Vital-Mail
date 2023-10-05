import { useContext } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import { FormCheck } from 'react-bootstrap';

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
		<div>
			<Navbar></Navbar>
			<Table>
				<tbody>
					{displayList.map((mail) => (
						<tr key={mail.id} onClick={() => navViewMail(mail.id)}>
							<td>
								<FormCheck id={`${mail.id}-checkbox`} value={mail.id} onClick={(e) => e.stopPropagation()} />
							</td>
							<td>{mail.from.name}</td>
							<td>{mail.subject}</td>
							<td>{mail.preview}</td>
							<td>{mail.time}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
}
