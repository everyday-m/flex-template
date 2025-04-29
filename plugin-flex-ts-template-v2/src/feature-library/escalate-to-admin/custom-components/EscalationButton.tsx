import React from 'react';
import { Button } from '@twilio/flex-ui';
import { useDispatch } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { getFeatureFlags } from '../../../utils/configuration';
import EscalateToAdminConfig from '../types/ServiceConfiguration';

interface EscalationButtonProps {
    task?: ITask;
}

export const EscalationButton: React.FC<EscalationButtonProps> = ({ task }) => {
    const dispatch = useDispatch();

    const handleEscalate = async () => {
        if (!task) return;

        // Get the admin queue from configuration
        const config = getFeatureFlags()?.features?.escalate_to_admin as EscalateToAdminConfig;
        const adminQueue = config?.adminQueue;

        if (!adminQueue) {
            Actions.invokeAction('ShowNotification', {
                message: 'Admin queue is not configured. Please contact your administrator.',
                type: 'error'
            });
            return;
        }

        // Show confirmation dialog
        const confirmed = await Actions.invokeAction('ShowConfirmationDialog', {
            message: 'Are you sure you want to escalate this call to an admin?',
            title: 'Escalate Call'
        });

        if (confirmed) {
            try {
                // Transfer the call to the admin queue
                await task.transfer(adminQueue, {
                    mode: 'WARM',
                    priority: 1
                });

                Actions.invokeAction('ShowNotification', {
                    message: 'Call has been escalated to the admin queue',
                    type: 'success'
                });
            } catch (error) {
                Actions.invokeAction('ShowNotification', {
                    message: 'Failed to escalate call. Please try again.',
                    type: 'error'
                });
            }
        }
    };

    return (
        <Button
            onClick={handleEscalate}
            variant="primary"
            size="small"
        >
            Escalate to Admin
        </Button>
    );
}; 