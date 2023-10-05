import { useContext, useState, useEffect } from 'react';
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

	const [checked, setCheckedState] = useState(
		new Array(displayList.length).fill(false),
	);
	const [checkedIDs, setIDs] = useState(new Array(displayList.length).fill(''));
	const [checkAll, setCheckAll] = useState(false);

	const resetState = () => {
		setCheckedState(new Array(displayList.length).fill(false));
		setIDs(new Array(displayList.length).fill(''));
		setCheckAll(false);
	};

	useEffect(() => {
		resetState();
	}, [displayList]);

	// Navigation to content view of each mail entry
	const navViewMail = (id: string) => {
		navigation(`/mail/${id}`, { relative: 'path' });
	};

	// Alters Check State and Stored Message IDs
	const handleCheck = (position: number, id: string) => {
		const newCheckState = checked.map((item, index) =>
			index === position ? !item : item,
		);

		setCheckedState(newCheckState);

		if (newCheckState[position] == false) {
			const newIDState = checkedIDs;
			newIDState[position] = '';
			setIDs(newIDState);
		} else {
			const newIDState = checkedIDs;
			newIDState[position] = id;
			setIDs(newIDState);
		}
	};

	// Checks all messages for the current mailbox
	const handleCheckAll = () => {
		const stateAll = !checkAll;
		setCheckAll(stateAll);

		if (stateAll == false) {
			setCheckedState(new Array(displayList.length).fill(false));
			setIDs(new Array(displayList.length).fill(''));
		} else {
			setCheckedState(new Array(displayList.length).fill(true));
			const idArray = displayList.map((item) =>
				item.id
			);
			setIDs(idArray);
		}
	};

	return (
		<div>
			<Navbar className="mailActionBar">
				<FormCheck
					id={`checkbox-all`}
					value="all"
					checked={checkAll || false}
					onChange={() => handleCheckAll()}
				/>
			</Navbar>
			<Table>
				<tbody>
					{displayList.map((mail, index) => (
						<tr key={mail.id} onClick={() => navViewMail(mail.id)}>
							<td>
								<FormCheck
									id={`${mail.id}-checkbox`}
									value={mail.id}
									onClick={(e) => e.stopPropagation()}
									checked={checked[index] || false}
									onChange={() => handleCheck(index, mail.id)}
								/>
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
