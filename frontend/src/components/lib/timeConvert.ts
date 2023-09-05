import { mailListType } from "./SharedContext";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function timeSet(list: mailListType[]) {
	const setList = list;
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yearFromNow = new Date(
		now.getFullYear() - 1,
		now.getMonth(),
		now.getDate(),
	);
	for (const entry of setList) {
		const r = new Date(entry.timestamp);
		entry.dateValue = r;
		if (r.getTime() < yearFromNow.getTime()) {
			entry.time = '' + r.getFullYear();
		} else if (r.getTime() >= today.getTime()) {
			if (r.getMinutes() < 10) {
				entry.time = (r.getHours() % 12) + ':0' + r.getMinutes();
			} else {
				entry.time = (r.getHours() % 12) + ':' + r.getMinutes();
			}
			if (r.getHours() < 12) {
				entry.time += ' AM';
			} else {
				entry.time += ' PM';
			}
		} else {
			if (r.getDate() < 10) {
				entry.time = months[r.getMonth()] + r.getDate();
			} else {
				entry.time = months[r.getMonth()] + ' ' + r.getDate();
			}
		}
	}

	setList.sort((a, b) => b.dateValue.getTime() - a.dateValue.getTime());
	return setList;
}
