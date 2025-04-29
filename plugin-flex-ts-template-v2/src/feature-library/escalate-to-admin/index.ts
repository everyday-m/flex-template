import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
import { addEscalationButton } from './flex-hooks/components/TaskCanvasHeader';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return {
    name: 'escalate-to-admin',
    hooks: [addEscalationButton]
  };
};
