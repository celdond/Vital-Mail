import ViewMail from '../components/viewmailPage';
import { useParams } from 'react-router-dom';

export default function ViewMailPage() {
	const { id } = useParams();

	return (<ViewMail id={typeof(id) == 'string' ? id : null} />);
}
