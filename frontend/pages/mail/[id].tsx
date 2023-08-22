import ViewMailPage from '../../components/viewmail';
import { useParams } from 'next/navigation';

function ViewMail() {
	const params = useParams();
	return <ViewMailPage mid={params.id[0]} />;
}

export default ViewMail;
