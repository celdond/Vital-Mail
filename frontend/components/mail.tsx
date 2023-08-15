import { useContext } from 'react';
import { MailListContextType, MailListContext } from './lib/SharedContext';
import Table from 'react-bootstrap/Table';

function MailDisplay () {
    const displayList = useContext(MailListContext) as MailListContextType;

    return (
        <Table>
            <tbody>
                {displayList.map((mail) => (
                    <tr key={mail.mid}>
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
