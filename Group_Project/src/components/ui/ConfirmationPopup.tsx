import { X } from 'lucide-react';
import Button from './Button';

interface ConfirmationPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationPopup({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel} />
      
      <div className="relative bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl transform transition-all animate-scale-in">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {message}
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;