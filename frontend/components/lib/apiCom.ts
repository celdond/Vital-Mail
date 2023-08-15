import { serverUrl } from '../../serverConfig';

export async function callServer(
	targetUrl: string,
	method: 'GET' | 'PUT' | 'POST' | 'DELETE',
    body?: any,
	user?: string,
): Promise<Response> {
	const options: RequestInit = { method };
	options.headers = {};
	if (user) {
		const token = localStorage.getItem(`essentialMailToken`);
		options.headers['authorization'] = `Bearer ${token}`;
	}
	if (body) {
		options.body = JSON.stringify(body);
		options.headers['content-type'] = 'application/json';
	}

	const url = serverUrl + targetUrl;
	const response = await fetch(url, options);

	return response;
}
