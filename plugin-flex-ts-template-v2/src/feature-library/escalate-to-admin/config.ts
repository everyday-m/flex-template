import { getFeatureFlags } from '../../utils/configuration';
import EscalateToAdminConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.escalate_to_admin as EscalateToAdminConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
