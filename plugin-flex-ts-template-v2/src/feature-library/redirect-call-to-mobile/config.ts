import { getFeatureFlags } from '../../utils/configuration';
import RedirectCallToMobileConfig from './types/ServiceConfiguration';

const { enabled = false, redirectNumber = '+12147101818' } = (getFeatureFlags()?.features?.redirect_call_to_mobile as RedirectCallToMobileConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRedirectNumber = () => {
  return redirectNumber;
};
