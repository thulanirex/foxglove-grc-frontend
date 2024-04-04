import { BASE_API_URL } from '$lib/utils/constants';
import { listViewFields } from '$lib/utils/table';
import { tableSourceMapper, type TableSource } from '@skeletonlabs/skeleton';

import { CUSTOM_MODEL_FETCH_MAP } from '$lib/utils/crud';
import type { urlModel } from '$lib/utils/types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	let data = null;
	if (Object.prototype.hasOwnProperty.call(CUSTOM_MODEL_FETCH_MAP, params.model)) {
		const fetch_function = CUSTOM_MODEL_FETCH_MAP[params.model];
		data = await fetch_function({ fetch, params });
	} else {
		const endpoint = `${BASE_API_URL}/${params.model}/`;
		const res = await fetch(endpoint);
		data = await res.json().then((res) => res.results);
	}

	const bodyData = tableSourceMapper(data, listViewFields[params.model as urlModel].body);

	const headData: Record<string, string> = listViewFields[params.model as urlModel].body.reduce(
		(obj, key, index) => {
			obj[key] = listViewFields[params.model as urlModel].head[index];
			return obj;
		},
		{}
	);

	const table: TableSource = {
		head: headData,
		body: bodyData,
		meta: data // metaData
	};

	return { table };
}) satisfies LayoutServerLoad;
