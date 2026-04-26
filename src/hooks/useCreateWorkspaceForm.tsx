import { toast } from 'react-hot-toast';
import { useCreateWorkspaceMutation } from '../services/workspace.service';
import type { ErrorResponse, SuccessResponse } from '../types/api.type';
import type { WorkspaceCreateForm } from '../types/workspace.type';
import { useMutationHandler } from './useMutationHandler';
import { useDispatch } from 'react-redux';
import { closeModal } from '../redux/workspace.ui.slice';
import { useCreateWorkspaceModal } from './useCreateWorkspaceModal';

export const useCreateWorkspaceForm = () => {
  const dispatch = useDispatch();
  const defaultValues: WorkspaceCreateForm = {
    name: '',
    category: null,
    description: '',
  };

  const [createWorkspace] = useCreateWorkspaceMutation();
  const { handle } = useMutationHandler();
  const { close } = useCreateWorkspaceModal();

  const handleCreateWorkspaceSuccess = (data: SuccessResponse<any>) => {
    toast.success(data.message);
    close();
  };

  const handleCreateWorkspaceError = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleSubmit = (data: WorkspaceCreateForm) => {
    const { category, ...rest } = data;

    const req = {
      ...rest,
      categoryId: category?.value,
    };

    handle(() => createWorkspace(req), {
      onSuccess: handleCreateWorkspaceSuccess,
      onError: handleCreateWorkspaceError,
    });
  };

  return {
    onSubmit: handleSubmit,
    defaultValues,
  };
};
