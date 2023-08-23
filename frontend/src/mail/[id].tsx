import ViewMailPage from '../../components/viewmail';
import { useRouter } from 'next/router';

function ViewMail() {
	const router = useRouter();
	const id = router.query.id;

	return <ViewMailPage id={typeof(id) == 'string' ? id : null} />;
}

export default ViewMail;
