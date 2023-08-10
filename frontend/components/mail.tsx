import { useContext } from 'react';
import { mailListContextType, mailListContext } from './lib/SharedContext';
import Table from 'react-bootstrap/Table';

function MailDisplay () {
    const displayList = useContext(mailListContext) as mailListContextType;

    return (
        <Table>
            <tbody>
                {displayList.map((mail) => (
                    <tr key={mail.id}>
                        <td>mail.from.name</td>
                        <td>mail.subject</td>
                        <td>mail.preview</td>
                        <td>mail.time</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default MailDisplay;