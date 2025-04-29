import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
import { Notifications } from '@twilio/flex-ui';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  console.log('Redirect Call to Mobile Plugin: Checking if enabled...');

  if (!isFeatureEnabled()) {
    console.log('Redirect Call to Mobile Plugin: Feature is disabled');
    return {};
  }

  console.log('Redirect Call to Mobile Plugin: Feature is enabled and loading hooks');
  console.log('Available hooks:', hooks);

  // Show notification that the plugin is loaded
  Notifications.showNotification('redirectCallToMobileLoaded', {
    message: 'Call Redirection Plugin is active and ready to redirect calls',
    variant: 'success'
  });

  return { name: 'redirect-call-to-mobile', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
