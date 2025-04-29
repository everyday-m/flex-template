import { EscalationButton } from '../../custom-components/EscalationButton';
import { ITask } from '@twilio/flex-ui';
import { FlexComponent } from '../../../../types/feature-loader';

export const addEscalationButton = (flex: any) => {
    flex.TaskCanvasHeader.Content.add(
        (props: { task: ITask }) => <EscalationButton key="escalation-button" task={props.task} />,
        {
            sortOrder: -1,
            if: (props: { task: ITask }) => {
                // Only show the button for voice tasks
                return props.task.taskChannelUniqueName === 'voice';
            }
        }
    );
}; 