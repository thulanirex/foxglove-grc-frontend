import type { urlModel } from './types';
import { BASE_API_URL } from './constants';
import EvidenceFilePreview from '$lib/components/ModelTable/EvidenceFilePreview.svelte';
import LanguageDisplay from '$lib/components/ModelTable/LanguageDisplay.svelte';
import LibraryActions from '$lib/components/ModelTable/LibraryActions.svelte';
import UserGroupNameDisplay from '$lib/components/ModelTable/UserGroupNameDisplay.svelte';

type GetOptionsParams = {
	objects: any[];
	suggestions?: any[];
	label?: string;
	value?: string;
};

export const getOptions = ({
	objects,
	suggestions,
	label = 'name',
	value = 'id',
	self = undefined,
	selfSelect = false
}: GetOptionsParams): {
	label: string;
	value: string;
	suggested: boolean;
	self: Record<string, any>;
	selfSelect: boolean;
}[] => {
	const options = objects
		.map((object) => {
			return {
				label: object[label],
				value: object[value],
				suggested: false
			};
		})
		.filter((option) => {
			if (selfSelect) {
				return true;
			}
			return option.value !== self?.id;
		});

	if (suggestions) {
		const suggestedIds = suggestions.map((suggestion) => suggestion[value]);

		const filteredOptions = options.filter((option) => {
			const isSuggested = suggestedIds.includes(option.value);
			if (isSuggested) {
				option.suggested = true;
			}
			return !isSuggested;
		});

		const suggestedOptions = options.filter((option) => option.suggested);
		const reorderedOptions = suggestedOptions.concat(filteredOptions);

		return reorderedOptions;
	}

	return options;
};

interface ForeignKeyField {
	field: string;
	urlModel: urlModel;
	urlParams?: string;
}

interface SelectField {
	field: string;
}

export interface ModelMapEntry {
	name: string;
	verboseName: string;
	verboseNamePlural?: string;
	urlModel?: urlModel;
	foreignKeyFields?: ForeignKeyField[];
	reverseForeignKeyFields?: ForeignKeyField[];
	selectFields?: SelectField[];
	filters?: SelectField[];
	[key: string]: any;
}

type ModelMap = {
	[key: string]: ModelMapEntry;
};

export const URL_MODEL_MAP: ModelMap = {
	folders: {
		name: 'folder',
		localName: 'domain',
		localNamePlural: 'domains',
		localFrGender: 'm',
		verboseName: 'Domain',
		verboseNamePlural: 'Domains',
		foreignKeyFields: [
			{ field: 'parent_folder', urlModel: 'folders', urlParams: 'content_type=GL' }
		],
		reverseForeignKeyFields: [{ field: 'folder', urlModel: 'projects' }]
	},
	projects: {
		name: 'project',
		localName: 'project',
		localNamePlural: 'projects',
		localFrGender: 'm',
		verboseName: 'Project',
		verboseNamePlural: 'Projects',
		foreignKeyFields: [{ field: 'folder', urlModel: 'folders', urlParams: 'content_type=DO' }],
		selectFields: [{ field: 'lc_status' }],
		reverseForeignKeyFields: [
			{ field: 'project', urlModel: 'risk-assessments' },
			{ field: 'project', urlModel: 'compliance-assessments' }
		],
		filters: [{ field: 'lc_status' }, { field: 'folder' }]
	},
	'risk-matrices': {
		name: 'riskmatrix',
		localName: 'riskMatrix',
		localNamePlural: 'riskMatrices',
		localFrGender: 'f',
		verboseName: 'Risk matrix',
		verboseNamePlural: 'Risk matrices',
		foreignKeyFields: [{ field: 'folder', urlModel: 'folders' }]
	},
	'risk-assessments': {
		name: 'riskassessment',
		localName: 'riskAssessment',
		localNamePlural: 'riskAssessments',
		localFrGender: 'f',
		verboseName: 'Risk assessment',
		verboseNamePlural: 'Risk assessments',
		foreignKeyFields: [
			{ field: 'project', urlModel: 'projects' },
			{ field: 'authors', urlModel: 'users' },
			{ field: 'reviewers', urlModel: 'users' },
			{ field: 'risk_matrix', urlModel: 'risk-matrices' },
			{ field: 'risk_scenarios', urlModel: 'risk-scenarios' }
		],
		reverseForeignKeyFields: [{ field: 'risk_assessment', urlModel: 'risk-scenarios' }],
		selectFields: [{ field: 'status' }],
		filters: [{ field: 'project' }, { field: 'auditor' }, { field: 'status' }]
	},
	threats: {
		ref_id: 'ref_id',
		name: 'threat',
		localName: 'threat',
		localNamePlural: 'threats',
		localFrGender: 'f',
		verboseName: 'Threat',
		verboseNamePlural: 'Threats',
		foreignKeyFields: [{ field: 'folder', urlModel: 'folders' }]
	},
	'risk-scenarios': {
		name: 'riskscenario',
		localName: 'riskScenario',
		localNamePlural: 'riskScenarios',
		localFrGender: 'm',
		verboseName: 'Risk scenario',
		verboseNamePlural: 'Risk scenarios',
		foreignKeyFields: [
			{ field: 'threats', urlModel: 'threats' },
			{ field: 'risk_assessment', urlModel: 'risk-assessments' },
			{ field: 'assets', urlModel: 'assets' },
			{ field: 'applied_controls', urlModel: 'applied-controls' },
			{ field: 'project', urlModel: 'projects' },
			{ field: 'risk_matrix', urlModel: 'risk-matrices' },
			{ field: 'auditor', urlModel: 'users' }
		],
		filters: [{ field: 'threats' }, { field: 'risk_assessment' }],
		search: false
	},
	'applied-controls': {
		name: 'appliedcontrol',
		localName: 'appliedControl',
		localNamePlural: 'appliedControls',
		localFrGender: 'f',
		verboseName: 'Applied control',
		verboseNamePlural: 'Applied controls',
		foreignKeyFields: [
			{ field: 'reference_control', urlModel: 'reference-controls' },
			{ field: 'folder', urlModel: 'folders' },
			{ field: 'evidences', urlModel: 'evidences' }
		],
		selectFields: [{ field: 'status' }, { field: 'category' }, { field: 'effort' }],
		filters: [
			{ field: 'reference_control' },
			{ field: 'status' },
			{ field: 'category' },
			{ field: 'effort' },
			{ field: 'folder' }
		]
	},
	policies: {
		name: 'appliedcontrol',
		localName: 'policy',
		localNamePlural: 'policies',
		localFrGender: 'f',
		verboseName: 'Policy',
		verboseNamePlural: 'Policies',
		foreignKeyFields: [
			{ field: 'reference_control', urlModel: 'reference-controls' },
			{ field: 'folder', urlModel: 'folders' },
			{ field: 'evidences', urlModel: 'evidences' }
		],
		selectFields: [{ field: 'status' }, { field: 'effort' }],
		filters: [
			{ field: 'reference_control' },
			{ field: 'status' },
			{ field: 'effort' },
			{ field: 'folder' }
		]
	},
	'risk-acceptances': {
		name: 'riskacceptance',
		localName: 'riskAcceptance',
		localNamePlural: 'riskAcceptances',
		localFrGender: 'f',
		verboseName: 'Risk acceptance',
		verboseNamePlural: 'Risk acceptances',
		foreignKeyFields: [
			{
				field: 'risk_scenarios',
				urlModel: 'risk-scenarios',
				urlParams: '/acceptable'
			},
			{ field: 'folder', urlModel: 'folders' },
			{ field: 'approver', urlModel: 'users', urlParams: 'is_approver=true' }
		],
		filters: [{ field: 'risk_scenarios' }, { field: 'folder' }, { field: 'approver' }]
	},
	'reference-controls': {
		ref_id: 'ref_id',
		name: 'referencecontrol',
		localName: 'referenceControl',
		localNamePlural: 'referenceControls',
		localFrGender: 'f',
		verboseName: 'Reference control',
		verboseNamePlural: 'Reference controls',
		foreignKeyFields: [{ field: 'folder', urlModel: 'folders' }],
		selectFields: [{ field: 'category' }],
		filters: [{ field: 'folder' }]
	},
	assets: {
		name: 'asset',
		localName: 'asset',
		localNamePlural: 'assets',
		localFrGender: 'm',
		verboseName: 'Asset',
		verboseNamePlural: 'Assets',
		foreignKeyFields: [
			{ field: 'parent_assets', urlModel: 'assets' },
			{ field: 'folder', urlModel: 'folders' }
		],
		selectFields: [{ field: 'type' }],
		filters: [{ field: 'parent_assets' }, { field: 'folder' }, { field: 'type' }]
	},
	users: {
		name: 'user',
		localName: 'user',
		localNamePlural: 'users',
		localFrGender: 'm',
		verboseName: 'User',
		verboseNamePlural: 'Users',
		foreignKeyFields: [{ field: 'user_groups', urlModel: 'user-groups' }],
		filters: []
	},
	'user-groups': {
		name: 'usergroup',
		localName: 'userGroup',
		localNamePlural: 'userGroups',
		localFrGender: 'm',
		verboseName: 'User group',
		verboseNamePlural: 'User groups',
		foreignKeyFields: [{ field: 'folder', urlModel: 'folders' }],
		filters: []
	},
	'role-assignments': {
		name: 'roleassignment',
		localName: 'roleAssignment',
		localNamePlural: 'roleAssignments',
		localFrGender: 'f',
		verboseName: 'Role assignment',
		verboseNamePlural: 'Role assignments',
		foreignKeyFields: [],
		filters: []
	},
	frameworks: {
		ref_id: 'ref_id',
		name: 'framework',
		localName: 'framework',
		localNamePlural: 'frameworks',
		localFrGender: 'm',
		verboseName: 'Framework',
		verboseNamePlural: 'Frameworks',
		foreignKeyFields: [
			{
				field: 'folder',
				urlModel: 'folders'
			}
		]
	},
	evidences: {
		name: 'evidence',
		localName: 'evidence',
		localNamePlural: 'evidences',
		localFrGender: 'f',
		verboseName: 'Evidence',
		verboseNamePlural: 'Evidences',
		foreignKeyFields: [
			{ field: 'folder', urlModel: 'folders' },
			{ field: 'applied_controls', urlModel: 'applied-controls' },
			{ field: 'requirement_assessments', urlModel: 'requirement-assessments' }
		]
	},
	'compliance-assessments': {
		name: 'complianceassessment',
		localName: 'complianceAssessment',
		localNamePlural: 'complianceAssessments',
		localFrGender: 'f',
		verboseName: 'Compliance assessment',
		verboseNamePlural: 'Compliance assessments',
		foreignKeyFields: [
			{ field: 'project', urlModel: 'projects' },
			{ field: 'framework', urlModel: 'frameworks' },
			{ field: 'authors', urlModel: 'users' },
			{ field: 'reviewers', urlModel: 'users' }
		],
		selectFields: [{ field: 'status' }],
		filters: [{ field: 'status' }]
	},
	requirements: {
		ref_id: 'ref_id',
		name: 'requirement',
		localName: 'requirement',
		localNamePlural: 'requirements',
		localFrGender: 'f',
		verboseName: 'Requirement',
		verboseNamePlural: 'Requirements'
	},
	'requirement-assessments': {
		name: 'requirementassessment',
		localName: 'requirementAssessment',
		localNamePlural: 'requirementAssessments',
		localFrGender: 'f',
		verboseName: 'Requirement assessment',
		verboseNamePlural: 'Requirement assessments',
		selectFields: [{ field: 'status' }],
		foreignKeyFields: [
			{ field: 'applied_controls', urlModel: 'applied-controls' },
			{ field: 'evidences', urlModel: 'evidences' },
			{ field: 'compliance_assessment', urlModel: 'compliance-assessments' }
		]
	},
	libraries: {
		name: 'library',
		localName: 'library',
		localNamePlural: 'libraries',
		localFrGender: 'f',
		verboseName: 'Library',
		verboseNamePlural: 'Libraries'
	}
};

export const FIELD_COMPONENT_MAP = {
	evidences: {
		attachment: EvidenceFilePreview
	},
	libraries: {
		locale: LanguageDisplay,
		actions: LibraryActions
	},
	'user-groups': {
		localization_dict: UserGroupNameDisplay
	}
};

// Il faut afficher le tag "draft" pour la column name !

interface TagConfig {
	key: string;
	values: {
		[key: string]: {
			text: string;
			cssClasses: string;
		};
	};
}

interface FieldColoredTagMap {
	[key: string]: {
		[key: string]: TagConfig[] | TagConfig;
	};
}

export const FIELD_COLORED_TAG_MAP: FieldColoredTagMap = {
	'risk-assessments': {
		name: {
			key: 'status',
			values: {
				planned: { text: 'planned', cssClasses: 'badge bg-indigo-300' },
				in_progress: { text: 'inProgress', cssClasses: 'badge bg-yellow-300' },
				in_review: { text: 'inReview', cssClasses: 'badge bg-cyan-300' },
				done: { text: 'done', cssClasses: 'badge bg-lime-300' },
				deprecated: { text: 'deprecated', cssClasses: 'badge bg-orange-300' }
			}
		}
	},
	'risk-scenarios': {
		name: {
			key: 'treatment',
			values: {
				Open: { text: 'open', cssClasses: 'badge bg-green-300' },
				Mitigate: { text: 'mitigate', cssClasses: 'badge bg-lime-200' },
				Accept: { text: 'accept', cssClasses: 'badge bg-green-200' },
				Avoid: { text: 'avoid', cssClasses: 'badge bg-red-200' },
				Transfer: { text: 'transfer', cssClasses: 'badge bg-yellow-300' }
			}
		}
	},
	'compliance-assessments': {
		name: {
			key: 'status',
			values: {
				planned: { text: 'planned', cssClasses: 'badge bg-indigo-300' },
				in_progress: { text: 'inProgress', cssClasses: 'badge bg-yellow-300' },
				in_review: { text: 'inReview', cssClasses: 'badge bg-cyan-300' },
				done: { text: 'done', cssClasses: 'badge bg-lime-300' },
				deprecated: { text: 'deprecated', cssClasses: 'badge bg-orange-300' }
			}
		}
	},
	assets: {
		name: {
			key: 'type',
			values: {
				Primary: { text: 'primary', cssClasses: 'badge bg-blue-200' }
			}
		}
	},
	'applied-controls': {
		name: {
			key: 'status',
			values: {
				Planned: { text: 'planned', cssClasses: 'badge bg-blue-200' },
				Active: { text: 'active', cssClasses: 'badge bg-green-200' },
				Inactive: { text: 'inactive', cssClasses: 'badge bg-red-300' },
				null: { text: 'undefined', cssClasses: 'badge bg-gray-300' }
			}
		}
	},
	projects: {
		name: {
			key: 'lc_status',
			values: {
				Dropped: { text: 'dropped', cssClasses: 'badge bg-red-200' }
			}
		}
	}
};

export const CUSTOM_MODEL_FETCH_MAP: { [key: string]: (load_data: any) => any } = {
	frameworks: async ({ fetch }) => {
		const endpoint = `${BASE_API_URL}/frameworks/`;
		const res = await fetch(endpoint);
		const response_data = await res.json();
		const frameworks = response_data.results;

		let compliance_assessment_req = null;
		let compliance_assessment_data = null;

		for (const framework of frameworks) {
			compliance_assessment_req = await fetch(
				`${BASE_API_URL}/compliance-assessments/?framework=${framework.id}`
			);
			compliance_assessment_data = await compliance_assessment_req.json();
			framework.compliance_assessments = compliance_assessment_data.count;
		}

		return frameworks;
	}
};

export const urlParamModelVerboseName = (model: string): string => {
	return URL_MODEL_MAP[model]?.verboseName || '';
};

export const urlParamModelForeignKeyFields = (model: string): ForeignKeyField[] => {
	return URL_MODEL_MAP[model]?.foreignKeyFields || [];
};

export const urlParamModelSelectFields = (model: string): SelectField[] => {
	return URL_MODEL_MAP[model]?.selectFields || [];
};

export const getModelInfo = (model: string): ModelMapEntry => {
	const map = URL_MODEL_MAP[model] || {};
	map['urlModel' as urlModel] = model;
	return map;
};

export function processObject(
	data: Record<string, any>,
	regex: RegExp,
	computeReplacement: (matchedString: string) => string
): void {
	for (const key in data) {
		if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

		if (typeof data[key] === 'object' && data[key] !== null) {
			processObject(data[key], regex, computeReplacement); // Recursive call for objects
		} else if (typeof data[key] === 'string') {
			data[key] = data[key].replace(regex, (match: string) => computeReplacement(match)); // Compute replacement for matched strings
		} else if (Array.isArray(data[key])) {
			data[key] = data[key].map(
				(item: any) =>
					typeof item === 'string'
						? item.replace(regex, (match) => computeReplacement(match)) // Compute replacement for matched strings in arrays
						: processObject(item, regex, computeReplacement) // Recursive call for objects in arrays
			);
		}
	}
}
