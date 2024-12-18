import { getModal } from '../../modal/modal.js';
import Modal from './modal.js';
import ConfirmationModal from './confirmationModal.js';
import { createTag } from '../../../utils/utils.js';
import { useState, useEffect } from '../../../deps/htm-preact.js';
import { project } from '../store.js';

export default function useInputActions() {
  const [languageCount, setLanguageCount] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [apiError, setApiError] = useState('');

  const projectCreatedModal = (type) => {
    const div = createTag('div');
    const content = Modal(div, type);
    const modalOpts = { id: 'projectCreate-modal', content, closeEvent: 'closeModal' };

    return getModal(null, modalOpts);
  };

  const projectConfirmationModal = () => {
    const div = createTag('div');
    const content = ConfirmationModal(div, setApiError, projectCreatedModal);
    const modalOpts = { id: 'confirmation-modal', content, closeEvent: 'closeConfirmationModal' };
    return getModal(null, modalOpts);
  };

  const validateForm = () => {
    const allValid = project.value.languages.every(
      (entry) => entry.action,
    );
    setIsFormValid(allValid);
  };

  useEffect(() => {
    if (project.value?.languages?.length > 0) {
      setLanguageCount(project.value?.languages?.length);
    }
    validateForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActionSelect = (ev, entry) => {
    entry.action = ev.target.value;
    validateForm();
  };

  const handleWorkflowSelect = (ev, entry) => {
    entry.workflow = ev.target.value;
    validateForm();
  };

  return {
    languageCount,
    isFormValid,
    validateForm,
    handleActionSelect,
    handleWorkflowSelect,
    projectCreatedModal,
    apiError,
    setApiError,
    projectConfirmationModal,
  };
}
