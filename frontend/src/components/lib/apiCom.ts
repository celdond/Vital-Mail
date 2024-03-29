import { serverUrl } from '../../../serverConfig';

// callServer:
//
// API call function
//
// targetURL - target endpoint in the api to call
// method 	 - method type to use for call
// body		 - content of API call
// token	 - Bearer user token to verify sign in
export async function callServer(
	targetUrl: string,
	method: 'GET' | 'PUT' | 'POST' | 'DELETE',
	body?: any,
	token?: string,
): Promise<Response> {
	const options: RequestInit = { method };
	options.headers = {};
	if (token) {
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
