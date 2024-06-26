import { mailType } from './lib/SharedContext';
import { moveSlip, getSlip, getBoxes } from './lib/slipFunctions';
import { useState, useEffect } from 'react';
import { BoxArrowLeft, Mailbox } from 'react-bootstrap-icons';
import { Container, Col, Row, Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export interface ViewMailProps {
	id: string;
}

const emptyMail = {
	id: '',
	from: {
		name: '',
		email: '',
	},
	to: {
		name: '',
		email: '',
	},
	subject: '',
	content: '',
	time: '',
	timestamp: '',
};

// ViewMailPage:
//
// Page to view message contents
//
// props:
// id - Message id for content to display
export default function ViewMailPage(props: ViewMailProps) {
	const account = localStorage.getItem(`essentialMailToken`);
	const user = JSON.parse(account);
	const navigation = useNavigate();

	const [mail, setMail] = useState<mailType>(emptyMail);
	const [mailboxes, setBoxes] = useState<string[]>([]);

	useEffect(() => {
		getSlip(setMail, props.id, user);
	}, [props.id]);

	useEffect(() => {
		getBoxes(setBoxes, user);
	}, [props.id]);

	return (
		<main className="backplate">
			<Container className="mailpage">
				<Col className="full">
					<div className="simpleBar">
						<Button className="simpleBarButton">
							<BoxArrowLeft size={28} onClick={() => navigation('/mail')} />
						</Button>
						<Dropdown>
							<Dropdown.Toggle className="simpleBarButton" id="dropdown-basic">
								<Mailbox size={28} />
							</Dropdown.Toggle>

							<Dropdown.Menu>
								{mailboxes.map((mailbox) => (
									<Dropdown.Item
										key={`action-${mailbox}`}
										id={`action-${mailbox}`}
										onClick={() => moveSlip(mailbox, [props.id], user)}
									>
										{mailbox}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<div className="mailview">
						<h1>{mail.subject}</h1>
						<Row xs="auto" className="justify-content-between">
							<Col>
								<Row>
									<span className="bold">{mail.from.name}</span>
								</Row>
								<Row>
									<span>{mail.from.email}</span>
								</Row>
							</Col>
							<Col></Col>
							<Col>
								<span>{mail.time}</span>
							</Col>
						</Row>
						<div className="content">
							<p>{mail.content}</p>
						</div>
					</div>
				</Col>
			</Container>
		</main>
	);
}
