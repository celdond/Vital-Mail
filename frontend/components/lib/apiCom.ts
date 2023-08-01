import { serverUrl } from "../../serverConfig";

export async function callServer(method: 'GET' | 'PUT' | 'POST' | 'DELETE',
targetUrl: string,
user?: string,
body?: any): Promise<any> {
    const options: RequestInit = { method };
    options.headers = {};
    if (user) {
        const token = localStorage.getItem(`essentialMailToken/${user}`);
        options.headers['authorization'] = `Bearer ${token}`;
    }
    if (body) {
        options.body = JSON.stringify(body);
        options.headers['content-type'] = 'application/json';
    }

    const url = serverUrl + targetUrl;
    const request = await fetch(url, options);

    return request;
};
