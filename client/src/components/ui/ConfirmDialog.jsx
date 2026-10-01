import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ open, title = 'Are you sure?', description, onConfirm, onCancel, confirmLabel = 'Delete' }) => (
  <Modal open={open} onClose={onCancel} title={title}>
    {description && <p className="mb-6 text-sm text-paper-400">{description}</p>}
    <div className="flex justify-end gap-3">
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
