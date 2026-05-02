import toast from 'react-hot-toast';
import { useUpdateCardMutation } from '../services/card.service';
import type { ErrorResponse } from '../types/api.type';
import { useMutationHandler } from './useMutationHandler';

export enum UpdateCardField {
  COMPLETED = 'isCompleted',
  DESCRIPTION = 'description'
}

export const useUpdateCard = (id: string, field: string) => {
  const { handle } = useMutationHandler();
  const [updateCard] = useUpdateCardMutation();

  const handleUpdateCardError = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleSubmit = (data: any) => {
    handle(() => updateCard({ id, [field]: data[field] }), {
      hasLoading: false,
      onError: handleUpdateCardError,
    });
  };

  return { onSubmit: handleSubmit };
};
