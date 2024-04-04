import { BASE_API_URL } from '$lib/utils/constants';
import type { User } from '$lib/utils/types';
import { redirect, type Handle, type RequestEvent, type HandleFetch } from '@sveltejs/kit';

async function ensureCsrfToken(event: RequestEvent): Promise<string> {
	let csrfToken = event.cookies.get('csrftoken') || '';
	if (!csrfToken) {
		const response = await fetch(`${BASE_API_URL}/csrf/`, {
			credentials: 'include',
			headers: { 'content-type': 'application/json' }
		});
		const data = await response.json();
		csrfToken = data.csrfToken;
		event.cookies.set('csrftoken', csrfToken, {
			httpOnly: false,
			sameSite: 'lax',
			path: '/',
			secure: true
		});
	}
	return csrfToken;
}

async function validateUserSession(event: RequestEvent): Promise<User | null> {
	const session = event.cookies.get('sessionid');
	if (!session) return null;

	const res = await fetch(`${BASE_API_URL}/iam/current-user/`, {
		credentials: 'include',
		headers: {
			'content-type': 'application/json',
			Cookie: `sessionid=${session}`
		}
	});

	if (!res.ok) {
		event.cookies.delete('sessionid', {
			path: '/'
		});
		redirect(302, `/login?next=${event.url.pathname}`);
	}
	return res.json();
}

export const handle: Handle = async ({ event, resolve }) => {
	await ensureCsrfToken(event);

	if (event.locals.user) return await resolve(event);

	const user = await validateUserSession(event);
	if (user) {
		event.locals.user = user;
	}

	return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event: { cookies } }) => {
	const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

	if (request.url.startsWith(BASE_API_URL)) {
		request.headers.set('Content-Type', 'application/json');

		const sessionid = cookies.get('sessionid');
		const csrfToken = cookies.get('csrftoken');

		if (sessionid) {
			request.headers.append('Cookie', `sessionid=${sessionid}`);
		}

		if (unsafeMethods.has(request.method) && csrfToken) {
			request.headers.append('X-CSRFToken', csrfToken);
			request.headers.append('Cookie', `csrftoken=${csrfToken}`);
		}
	}

	return fetch(request);
};
