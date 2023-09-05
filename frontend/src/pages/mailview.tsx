import ViewMailPage from '../components/viewmail';
import { useParams } from 'react-router-dom';

function ViewMail() {
	const { id } = useParams();

	return (<div>Baba<ViewMailPage id={typeof(id) == 'string' ? id : null} /></div>);
}

export default ViewMail;
