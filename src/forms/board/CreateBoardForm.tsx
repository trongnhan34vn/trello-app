import { useTranslation } from 'react-i18next';
import Form from '..';
import Button from '../../components/Button';
import ImagePickerField from '../../components/form/ImagePickerField';
import SelectField from '../../components/form/SelectField';
import TextField from '../../components/form/TextField';
import type { Image } from '../../types/image.type';
import { useListWorkspaceQuery } from '../../services/workspace.service';
import type { Board, BoardCreateForm } from '../../types/board.type';
import { useCreateBoardMutation } from '../../services/board.service';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { buildRouteWithId, ROUTES } from '../../routes';
import type { Workspace } from '../../types/workspace.type';
import { useMemo } from 'react';

interface IProps {
  images: Image[];
  defaultWorkspace?: Workspace | null;
}
const CreateBoardForm = ({ images = [], defaultWorkspace }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: workspaceApiRes } = useListWorkspaceQuery('');
  const workspaces = workspaceApiRes ? workspaceApiRes.data : [];
  const workspaceOptions = workspaces.map((w) => ({ label: w.name, value: w.id }));

  const defaultValues = useMemo(() => {
    const base = {
      name: '',
      background: null
    }
    if (defaultWorkspace) {
      return {...base, workspace: workspaceOptions.find(wo => wo.value == defaultWorkspace.id)}
    } else {
      return {...base, workspace: null}
    }
  }, [defaultWorkspace])

  const [createBoard] = useCreateBoardMutation();
  const { handle } = useMutationHandler();

  const handleCreateBoardSuccess = (data: SuccessResponse<Board>) => {
    toast.success(data.message);
    navigate(buildRouteWithId(ROUTES.BOARD, data.data.id))
  };

  const handleCreateBoardError = (error: ErrorResponse) => {
    toast.error(error.message)
  }

  const handleSubmit = (data: BoardCreateForm) => {
    
    const payload = {
      name: data.name,
      workspaceId: data.workspace?.value ?? '',
      backgroundUrl: data.background?.url ?? '',
    };

    handle(() => createBoard(payload), {
      onSuccess: handleCreateBoardSuccess,
      onError: handleCreateBoardError
    })
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
      <ImagePickerField
        list={images ?? []}
        label={t('dashboard:board_create_form.field.background.label')}
        name="background"
        hasPreview
      />

      <TextField
        name="name"
        rules={{
          required: t('dashboard:board_create_form.field.title.required'),
        }}
        label={t('dashboard:board_create_form.field.title.label')}
      />

      <SelectField
        label={t('dashboard:board_create_form.field.workspace.label')}
        name="workspace"
        placeholder={t('dashboard:board_create_form.field.workspace.placeholder')}
        options={async () => workspaceOptions}
        rules={{
          required: t('dashboard:board_create_form.field.workspace.required'),
        }}
      />

      <Button className="w-full border-none">Create</Button>
    </Form>
  );
};

export default CreateBoardForm;
