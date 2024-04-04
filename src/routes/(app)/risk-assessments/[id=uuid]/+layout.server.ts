import { BASE_API_URL } from '$lib/utils/constants';
import { getModelInfo } from '$lib/utils/crud';

import { modelSchema } from '$lib/utils/schemas';
import { tableSourceMapper, type TableSource } from '@skeletonlabs/skeleton';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const endpoint = `${BASE_API_URL}/risk-assessments/${params.id}/`;

	const risk_assessment = await fetch(endpoint).then((res) => res.json());
	const scenarios = await fetch(`${BASE_API_URL}/risk-scenarios/?risk_assessment=${params.id}`)
		.then((res) => res.json())
		.then((res) => res.results);

	const risk_matrix = await fetch(
		`${BASE_API_URL}/risk-matrices/${risk_assessment.risk_matrix.id}/`
	).then((res) => res.json());

	const scenariosTable: TableSource = {
		head: [
			'rid',
			'name',
			'threats',
			'existingControls',
			'currentLevel',
			'appliedControls',
			'residualLevel'
		],
		body: tableSourceMapper(scenarios, [
			'rid',
			'name',
			'threats',
			'existing_controls',
			'current_level',
			'applied_controls',
			'residual_level'
		]),
		meta: scenarios
	};

	risk_assessment.risk_scenarios = scenarios;
	risk_assessment.risk_matrix = risk_matrix;

	const deleteSchema = z.object({ id: z.string() });
	const scenarioDeleteForm = await superValidate(deleteSchema);

	const scenarioSchema = modelSchema('risk-scenarios');
	const initialData = {
		risk_assessment: params.id
	};
	const scenarioCreateForm = await superValidate(initialData, scenarioSchema, {
		errors: false
	});

	const scenarioModel = getModelInfo('risk-scenarios');

	const foreignKeys: Record<string, any> = {};

	if (scenarioModel.foreignKeyFields) {
		for (const keyField of scenarioModel.foreignKeyFields) {
			const queryParams = keyField.urlParams ? `?${keyField.urlParams}` : '';
			const url = `${BASE_API_URL}/${keyField.urlModel}/${queryParams}`;
			const response = await fetch(url);
			if (response.ok) {
				foreignKeys[keyField.field] = await response.json().then((data) => data.results);
			} else {
				console.error(`Failed to fetch data for ${keyField.field}: ${response.statusText}`);
			}
		}
	}

	scenarioModel.foreignKeys = foreignKeys;

	const selectOptions: Record<string, any> = {};

	if (scenarioModel.selectFields) {
		for (const selectField of scenarioModel.selectFields) {
			const url = `${BASE_API_URL}/risk-scenarios/${selectField.field}/`;
			const response = await fetch(url);
			if (response.ok) {
				selectOptions[selectField.field] = await response.json().then((data) =>
					Object.entries(data).map(([key, value]) => ({
						label: value,
						value: key
					}))
				);
			} else {
				console.error(`Failed to fetch data for ${selectField.field}: ${response.statusText}`);
			}
		}
	}

	scenarioModel.selectOptions = selectOptions;

	return { risk_assessment, scenarioModel, scenariosTable, scenarioDeleteForm, scenarioCreateForm };
};
