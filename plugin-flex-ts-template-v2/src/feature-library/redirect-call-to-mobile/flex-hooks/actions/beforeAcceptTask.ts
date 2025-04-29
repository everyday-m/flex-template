import { Manager, Notifications } from '@twilio/flex-ui';
import { getRedirectNumber } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SelectTask;

// This action hook intercepts incoming voice tasks before they are accepted
// It captures the caller's phone number from the task attributes and forwards
// the call to a configured mobile number using a Twilio Function
// The Twilio Function handles creating the outbound call to connect the original
// caller with the mobile number


export const actionHook = function handleRedirectCall(flex: any, _manager: Manager) {
    console.log('Redirect Call to Mobile: Setting up action listener for', `${actionEvent}${actionName}`);

    flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload: any, abortFunction: () => void) => {
        console.log('Redirect Call to Mobile: SelectTask hook triggered');
        console.log('Task details:', payload.task);

        // Check if the task is a voice call
        if (payload.task.taskChannelUniqueName === 'voice') {
            console.log('Redirect Call to Mobile: Voice call detected');
            const taskAttributes = payload.task.attributes;

            // Get the original caller's number
            const originalCallerNumber = taskAttributes.from;
            console.log('Redirect Call to Mobile: Original caller number:', originalCallerNumber);

            // Get the redirect number from configuration
            const redirectNumber = getRedirectNumber();
            console.log('Redirect Call to Mobile: Redirect number from config:', redirectNumber);

            if (!redirectNumber) {
                console.error('Redirect Call to Mobile: Redirect number not configured');
                return;
            }

            try {
                // Show notification that call is being redirected
                Notifications.showNotification('callRedirect', {
                    message: `Redirecting call from ${originalCallerNumber} to ${redirectNumber}`,
                    variant: 'info'
                });

                console.log('Redirect Call to Mobile: Starting redirect process');
                console.log('Redirect Call to Mobile: Making request to Twilio Function');
                console.log('Request URL:', 'https://almond-louse-9956.twil.io/callForward');

                const requestBody = {
                    PhoneNumber: redirectNumber,
                    To: redirectNumber,
                    From: originalCallerNumber
                };
                console.log('Request body:', requestBody);

                try {
                    // Call the Twilio Function to make the outbound call
                    console.log('Redirect Call to Mobile: Attempting fetch request...');
                    const response = await fetch('https://almond-louse-9956.twil.io/callForward', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Twilio-Signature': _manager.user.token // This is the token that Twilio Functions expect
                        },
                        body: JSON.stringify(requestBody)
                    });

                    console.log('Redirect Call to Mobile: Fetch request completed');
                    console.log('Redirect Call to Mobile: Function response status:', response.status);
                    console.log('Redirect Call to Mobile: Function response status text:', response.statusText);

                    const responseText = await response.text();
                    console.log('Redirect Call to Mobile: Function response body:', responseText);

                    if (!response.ok) {
                        throw new Error(`Failed to redirect call: ${response.status} ${response.statusText} - ${responseText}`);
                    }

                    // Show success notification
                    Notifications.showNotification('callRedirectSuccess', {
                        message: `Call successfully redirected to ${redirectNumber}`,
                        variant: 'success'
                    });

                    // Abort the task selection since we're redirecting
                    abortFunction();
                } catch (fetchError: any) {
                    console.error('Redirect Call to Mobile: Fetch error details:', {
                        name: fetchError?.name,
                        message: fetchError?.message,
                        stack: fetchError?.stack,
                        type: fetchError?.type,
                        cause: fetchError?.cause
                    });
                    throw fetchError;
                }
            } catch (error: any) {
                console.error('Redirect Call to Mobile: Error redirecting call:', error);
                console.error('Redirect Call to Mobile: Error details:', {
                    name: error?.name,
                    message: error?.message,
                    stack: error?.stack,
                    type: error?.type,
                    cause: error?.cause
                });

                // Show error notification
                Notifications.showNotification('callRedirectError', {
                    message: `Failed to redirect call: ${error?.message || 'Unknown error'}`,
                    variant: 'error'
                });
                throw error;
            }
        } else {
            console.log('Redirect Call to Mobile: Not a voice call, skipping redirection');
        }
    });
}; 