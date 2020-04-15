import React from 'react';
import { Modal, TransitionablePortal } from 'semantic-ui-react';

const defaultTransition = { animation: 'fade', duration: 400 };

const TransitionableModal = ({ open, onClose, children, transition, ...modalProps }: any) => {
  return (
    <TransitionablePortal open={open} transition={transition || defaultTransition}>
      <Modal open={open} onClose={onClose} {...modalProps}>
        {children}
      </Modal>
    </TransitionablePortal>
  );
};

export default TransitionableModal;
