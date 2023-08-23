import { useContext } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';

function MailDisplay () {
    const displayList = useContext(MailListContext) as MailListContextType;
    const router = useRouter();

    const navViewMail = (id: string) => {
        router.push(`/mail/${id}`);
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
