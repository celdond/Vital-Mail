import ViewMailPage from '../components/viewmailPage';
import { useParams } from 'react-router-dom';

function ViewMail() {
	const { id } = useParams();

	return (<ViewMailPage id={typeof(id) == 'string' ? id : null} />);
}

export default ViewMail;
