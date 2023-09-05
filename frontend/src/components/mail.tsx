import { useContext } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function MailDisplay () {
    const displayList = useContext(MailListContext) as MailListContextType;
    const navigation = useNavigate();

    const navViewMail = (id: string) => {
        navigation(`/mail/${id}`, { relative: "path" });
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

export default MailDisplay;
