import { h, Component } from '../../../deps/htm-preact.js';
import {
  deleteStatusCheck,
  promoteStatusCheck,
  heading,
  enableActionButton,
} from '../utils/state.js';

class ConfirmationModal extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      promotePublishOption: 'promoteOnly', // Default value for the radio button
    };
  }

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  handleConfirm = () => {
    this.closeModal();
    if (this.props.onConfirm) {
      const doPublish = this.state.promotePublishOption === 'promotePublish';
        if (this.props.confirmMessage === 'Promote') {
        promoteStatusCheck.value = 'IN PROGRESS';
      } else if (this.props.confirmMessage === 'Delete') {
        deleteStatusCheck.value = 'IN PROGRESS';
      }
  
      this.props.onConfirm(doPublish);
    }
  };

  handleNoClick = () => {
    this.closeModal();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  handleRadioChange = (event) => {
    this.setState({ promotePublishOption: event.target.value });
  };

  render() {
    const { modalVisible, promotePublishOption } = this.state;
    const { actionName, confirmMessage, showRadioButtons } = this.props;

    const modalContent = modalVisible && h(
      'div',
      { id: 'modal-overlay' },
      h(
        'div',
        { id: 'fg-modal', class: 'modal-content larger-modal' },
        h(
          'p',
          { style: { fontWeight: 'bold' } },
          `Confirm ${confirmMessage}`
        ),
        h(
          'div',
          { style: { display: 'flex', marginBottom: '10px' } },
          h(
            'button',
            {
              class: 'fgui-urls-heading-action longer-button yes-btn', 
              onClick: this.handleConfirm,
            },
            'Yes'
          ),
          h(
            'button',
            {
              class: 'fgui-urls-heading-action longer-button no-btn', 
              onClick: this.handleNoClick,
            },
            'No'
          )
        ),
        showRadioButtons &&
          h(
            'div',
            { style: { display: 'flex', marginTop: '10px' } },
            h(
              'div',
              { style: { marginRight: '10px' } },
              h('input', {
                type: 'radio',
                name: 'promotePublishRadio',
                value: 'promoteOnly',
                checked: promotePublishOption === 'promoteOnly',
                onChange: this.handleRadioChange,
              }),
              h('label', { for: 'promoteOnly' }, 'Promote Only')
            ),
            h(
              'div',
              null,
              h('input', {
                type: 'radio',
                name: 'promotePublishRadio',
                value: 'promotePublish',
                checked: promotePublishOption === 'promotePublish',
                onChange: this.handleRadioChange,
              }),
              h(
                'label',
                { for: 'promotePublish' },
                'Promote and Publish Promoted Pages'
              )
            )
          )
      )
    );

    return h(
      'div',
      null,
      h(
        'div',
        { id: `${actionName}Action` },
        h(
          'button',
          {
            class: 'fgui-urls-heading-action', 
            onClick:
              (confirmMessage === 'Promote' &&
                promoteStatusCheck.value === 'IN PROGRESS') ||
              (confirmMessage === 'Delete' &&
                deleteStatusCheck.value === 'IN PROGRESS')
                ? undefined
                : this.openModal,
            disabled:
              confirmMessage === 'Promote'
                ? (promoteStatusCheck.value === 'IN PROGRESS'  ||
                ((new Date() < new Date(heading.value.endTime) && !enableActionButton.value)))
                : confirmMessage === 'Delete'
                ? (deleteStatusCheck.value === 'IN PROGRESS' ||
                ((new Date() < new Date(heading.value.endTime) && !enableActionButton.value)))
                : false,
            title:
              (confirmMessage === 'Promote' &&
                promoteStatusCheck.value === 'IN PROGRESS') ||
              (confirmMessage === 'Delete' &&
                deleteStatusCheck.value === 'IN PROGRESS')
                ? 'Operation is in progress. Please wait.'
                : ((new Date() < new Date(heading.value.endTime) && !enableActionButton.value)
                ? 'Operation is not accessible during the event time'
                : ''),
          },
          actionName
        )
      ),
      modalContent
    );
  }
}

export default ConfirmationModal;
