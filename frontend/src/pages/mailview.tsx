import ViewMailPage from '../components/viewmail';
import { useParams } from 'react-router-dom';

function ViewMail() {
	const { id } = useParams();

	return (<ViewMailPage id={typeof(id) == 'string' ? id : null} />);
}

export default ViewMail;
