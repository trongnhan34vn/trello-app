import { useTranslation } from 'react-i18next';
import Form from '..';
import Button from '../../components/Button';
import SelectField from '../../components/form/SelectField';
import TextAreaField from '../../components/form/TextAreaField';
import TextField from '../../components/form/TextField';
import { buildUrl, http, WORKSPACE_CATEGORY_ENDPOINT } from '../../services';
import type { WorkspaceCategory } from '../../types/workspace.category.type';
import type { WorkspaceCreateForm } from '../../types/workspace.type';
interface IProps {
  defaultValues: WorkspaceCreateForm;
  onSubmit: (data: WorkspaceCreateForm) => void;
}
const CreateWorkspaceForm = ({ defaultValues, onSubmit }: IProps) => {
  const { t } = useTranslation();

  const fetchWorkspaceCategory = async () => {
    const res = await http().get(buildUrl({ path: WORKSPACE_CATEGORY_ENDPOINT.LIST }));
    const data = res.data;
    const workspaceCategories = data.data as WorkspaceCategory[];
    return workspaceCategories.map((wc) => ({ label: wc.name, value: wc.id }));
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      <TextField
        name={'name'}
        label={t('dashboard:workspace_create_form.field.name.label')}
        placeholder={t('dashboard:workspace_create_form.field.name.placeholder')}
        rules={{
          required: t('dashboard:workspace_create_form.field.name.required'),
        }}
      />
      <SelectField
        label={t('dashboard:workspace_create_form.field.type.label')}
        name={'category'}
        placeholder={t('dashboard:workspace_create_form.field.type.placeholder')}
        options={fetchWorkspaceCategory}
        rules={{
          required: t('dashboard:workspace_create_form.field.type.required'),
        }}
      />
      <TextAreaField
        placeholder={t('dashboard:workspace_create_form.field.description.placeholder')}
        label={t('dashboard:workspace_create_form.field.description.label')}
        name="description"
      />
      <Button className="w-full mt-3 mb-2">{t('common:actions.continue')}</Button>
    </Form>
  );
};

export default CreateWorkspaceForm;
