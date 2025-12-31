export interface Idea {
  id: string;
  name: string;
  summary: string;
  domain: string;
  date: string;
  status: 'Exploring' | 'Built' | 'Rejected';
  spec?: string; // Markdown content of the build spec
}

export enum Domain {
  ECOMMERCE = 'eCommerce sellers',
  CREATORS = 'Content creators',
  COMPLIANCE = 'Small business compliance',
  FREELANCERS = 'Freelancers',
  REAL_ESTATE = 'Real estate',
  HEALTHCARE = 'Healthcare admin',
  LEGAL = 'Legal professionals',
  HR = 'HR/Recruiting',
  LOCAL_SERVICES = 'Local services',
  B2B_SALES = 'B2B sales'
}

export interface SessionState {
  step: 'SETUP' | 'DISCOVERY_LOADING' | 'DISCOVERY_RESULT' | 'SPEC_LOADING' | 'SPEC_RESULT';
  domain: Domain | '';
  discoveryResult: string;
  selectedWinnerName: string;
  selectedWinnerSummary: string;
  specResult: string;
}
