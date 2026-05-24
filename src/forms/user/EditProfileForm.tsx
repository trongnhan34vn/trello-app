import Button from '../../components/Button';
import TextAreaField from '../../components/form/TextAreaField';
import TextField from '../../components/form/TextField';
import Form from '../../forms';
import type { User } from '../../types/user.type';

interface EditProfileFormProps {
  user: User | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditProfileForm = ({ user, onSubmit, onCancel }: EditProfileFormProps) => {

  return (
    <Form
      defaultValues={{
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || '',
      }}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <TextField
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
        />
        <TextField
          name="address"
          label="Address"
          placeholder="Enter your address"
        />
        <TextAreaField
          name="bio"
          label="About Me"
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="text" type="button" className='text-text-muted! hover:text-red-500!' onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileForm;
