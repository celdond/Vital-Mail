import { useContext, useState, useEffect, Dispatch } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import { FormCheck, Dropdown, Button } from 'react-bootstrap';
import {
	Trash,
	Mailbox,
	ChevronRight,
	ChevronLeft,
} from 'react-bootstrap-icons';
import { moveSlip } from './lib/slipFunctions';

const applyChange = (
	box: string,
	ids: string[],
	user: any,
	updateFunction: Dispatch<boolean>,
	update: boolean,
) => {
	const sendIDs: string[] = [];

	for (let index = 0; index < ids.length; index++) {
		if (ids[index] != '') {
			sendIDs.push(ids[index]);
		}
	}

	moveSlip(box, sendIDs, user);
	updateFunction(!update);
};

const pageChange = (
	page: number,
	direction: number,
	pageFunction: Dispatch<number>,
) => {
	pageFunction(page + direction);
};

interface DisplayProps {
	updateFunction: Dispatch<boolean>;
	pageFunction: Dispatch<number>;
}

// MailboxDisplay:
//
// Table display for the current mailbox
export default function MailboxDisplay(props: DisplayProps) {
	const displayList = useContext(MailListContext) as MailListContextType;
	const navigation = useNavigate();

	const [checked, setCheckedState] = useState(
		new Array(displayList.mail.length).fill(false),
	);
	const [checkedIDs, setIDs] = useState(
		new Array(displayList.mail.length).fill(''),
	);
	const [checkAll, setCheckAll] = useState(false);

	const resetState = () => {
		setCheckedState(new Array(displayList.mail.length).fill(false));
		setIDs(new Array(displayList.mail.length).fill(''));
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
			setCheckedState(new Array(displayList.mail.length).fill(false));
			setIDs(new Array(displayList.mail.length).fill(''));
		} else {
			setCheckedState(new Array(displayList.mail.length).fill(true));
			const idArray = displayList.mail.map((item) => item.id);
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
				<Button
					variant="secondary"
					className="actionFunction"
					onClick={() =>
						applyChange(
							'Trash',
							checkedIDs,
							displayList.user,
							props.updateFunction,
							displayList.update,
						)
					}
				>
					<Trash />
				</Button>
				<Dropdown>
					<Dropdown.Toggle
						variant="secondary"
						className="actionDrop"
						id="dropdown-basic"
					>
						<Mailbox />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						{displayList.mailbox.map((box) => (
							<Dropdown.Item
								key={`action-${box}`}
								id={`action-${box}`}
								onClick={() =>
									applyChange(
										box,
										checkedIDs,
										displayList.user,
										props.updateFunction,
										displayList.update,
									)
								}
							>
								{box}
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
				<Button
					variant="secondary"
					className="actionFunction"
					onClick={() =>
						props.pageFunction((displayList.page ?? 0))
					}
				>
					<ChevronLeft />
				</Button>
				<Button
					variant="secondary"
					className="actionFunction"
					onClick={() =>
						applyChange(
							'Trash',
							checkedIDs,
							displayList.user,
							props.updateFunction,
							displayList.update,
						)
					}
				>
					<ChevronRight />
				</Button>
			</Navbar>
			<Table>
				<tbody>
					{displayList.mail.map((mail, index) => (
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
