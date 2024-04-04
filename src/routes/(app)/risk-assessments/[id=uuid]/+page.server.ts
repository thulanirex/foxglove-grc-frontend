import { BASE_API_URL } from '$lib/utils/constants';
import { urlParamModelVerboseName } from '$lib/utils/crud';

import * as m from '$paraglide/messages';
import { localItems, toCamelCase } from '$lib/utils/locales';
import { languageTag } from '$paraglide/runtime';

import { modelSchema } from '$lib/utils/schemas';
import { fail, type Actions } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();

		const schema = modelSchema(formData.get('urlmodel') as string);
		const urlModel = formData.get('urlmodel');

		const createForm = await superValidate(formData, schema);

		const endpoint = `${BASE_API_URL}/${urlModel}/`;

		if (!createForm.valid) {
			console.log(createForm.errors);
			return fail(400, { form: createForm });
		}

		if (formData) {
			const requestInitOptions: RequestInit = {
				method: 'POST',
				body: JSON.stringify(createForm.data)
			};
			const res = await fetch(endpoint, requestInitOptions);
			if (!res.ok) {
				const response = await res.json();
				console.log(response);
				if (response.non_field_errors) {
					setError(createForm, 'non_field_errors', response.non_field_errors);
				}
				return fail(400, { form: createForm });
			}
			const model: string = urlParamModelVerboseName(urlModel);
			// TODO: reference newly created object
			return message(createForm, m.successfullyCreatedObject({object: localItems(languageTag())[toCamelCase(model.toLowerCase())].toLowerCase()}));
		}
		return { createForm };
	},
	delete: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const schema = z.object({ urlmodel: z.string(), id: z.string().uuid() });
		const deleteForm = await superValidate(formData, schema);

		const id = deleteForm.data.id;
		const endpoint = `${BASE_API_URL}/risk-scenarios/${id}/`;

		if (!deleteForm.valid) {
			return fail(400, { form: deleteForm });
		}

		if (formData.has('delete')) {
			const requestInitOptions: RequestInit = {
				method: 'DELETE'
			};
			const res = await fetch(endpoint, requestInitOptions);
			if (!res.ok) {
				const response = await res.json();
				console.log(response);
				if (response.non_field_errors) {
					setError(deleteForm, 'non_field_errors', response.non_field_errors);
				}
				return fail(400, { form: deleteForm });
			}
			const model: string = urlParamModelVerboseName(params.model!);
			// TODO: reference object by name instead of id
			return message(deleteForm, m.successfullyDeletedObject({object: localItems(languageTag())[toCamelCase(model.toLowerCase())].toLowerCase()}));
		}
		return { deleteForm };
	}
};
