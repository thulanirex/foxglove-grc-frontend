export const listViewFields = {
	folders: {
		head: ['name', 'description', 'parentDomain'],
		body: ['name', 'description', 'parent_folder']
	},
	projects: {
		head: ['name', 'description', 'domain'],
		body: ['name', 'description', 'folder']
	},
	'risk-matrices': {
		head: ['name', 'description', 'provider', 'domain'],
		body: ['name', 'description', 'provider', 'folder'],
		meta: ['id', 'urn']
	},
	'risk-assessments': {
		head: ['name', 'riskMatrix', 'description', 'riskScenarios', 'project'],
		body: ['name', 'risk_matrix', 'description', 'risk_scenarios', 'project']
	},
	threats: {
		head: ['ref', 'name', 'description', 'provider', 'domain'],
		body: ['ref_id', 'name', 'description', 'provider', 'folder'],
		meta: ['id', 'urn']
	},
	'risk-scenarios': {
		head: [
			'name',
			'threats',
			'riskAssessment',
			'appliedControls',
			'currentLevel',
			'residualLevel'
		],
		body: [
			'name',
			'threats',
			'risk_assessment',
			'applied_controls',
			'current_level',
			'residual_level'
		]
	},
	'risk-acceptances': {
		head: ['name', 'description', 'riskScenarios'],
		body: ['name', 'description', 'risk_scenarios']
	},
	'applied-controls': {
		head: ['name', 'description', 'category', 'eta', 'domain', 'referenceControl'],
		body: ['name', 'description', 'category', 'eta', 'folder', 'reference_control']
	},
	policies: {
		head: ['name', 'description', 'eta', 'domain', 'referenceControl'],
		body: ['name', 'description', 'eta', 'folder', 'reference_control']
	},
	'reference-controls': {
		head: ['ref', 'name', 'description', 'category', 'provider', 'domain'],
		body: ['ref_id', 'name', 'description', 'category', 'provider', 'folder'],
		meta: ['id', 'urn']
	},
	assets: {
		head: ['name', 'description', 'businessValue', 'domain'],
		body: ['name', 'description', 'business_value', 'folder']
	},
	users: {
		head: ['email', 'firstName', 'lastName'],
		body: ['email', 'first_name', 'last_name']
	},
	'user-groups': {
		head: ['name'],
		body: ['localization_dict'],
		meta: ['id', 'builtin']
	},
	roles: {
		head: ['name', 'description'],
		body: ['name', 'description']
	},
	'role-assignments': {
		head: ['user', 'userGroup', 'role', 'perimeter'],
		body: ['user', 'user_group', 'role', 'perimeter_folders']
	},
	frameworks: {
		head: ['name', 'description', 'provider', 'complianceAssessments', 'domain'],
		body: ['name', 'description', 'provider', 'compliance_assessments', 'folder'],
		meta: ['id', 'urn']
	},
	'compliance-assessments': {
		head: ['name', 'framework', 'description', 'project'],
		body: ['name', 'framework', 'description', 'project']
	},
	'requirement-assessments': {
		head: ['name', 'description', 'complianceAssessment'],
		body: ['name', 'description', 'compliance_assessment']
	},
	evidences: {
		head: ['name', 'file', 'description'],
		body: ['name', 'attachment', 'description']
	},
	requirements: {
		head: ['ref', 'name', 'description', 'framework'],
		body: ['ref_id', 'name', 'description', 'framework'],
		meta: ['id', 'urn']
	},
	libraries: {
		head: ['ref', 'name', 'description', 'language', 'overview'],
		body: ['ref_id', 'name', 'description', 'locale', 'overview']
	}
};
