import Button from '../../components/Button';
import TextField from '../../components/form/TextField';
import Form from '../../forms';
import { Regex } from '../../constants';

interface ChangePasswordFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ChangePasswordForm = ({ onSubmit, onCancel }: ChangePasswordFormProps) => {
  return (
    <Form
      defaultValues={{
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
      onSubmit={onSubmit}
    >
      {({ watch }: any) => {
        const newPassword = watch('newPassword');

        return (
          <>
            <div className="space-y-4">
              <TextField
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                type="password"
                rules={{
                  required: 'Current password is required',
                }}
              />
              <TextField
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                rules={{
                  required: 'New password is required',
                  pattern: {
                    value: Regex.PASSWORD_REGEX,
                    message: 'Password must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, and 1 number.',
                  },
                }}
              />
              <TextField
                name="confirmNewPassword"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type="password"
                rules={{
                  required: 'Please confirm your new password',
                  pattern: {
                    value: Regex.PASSWORD_REGEX,
                    message: 'Password must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, and 1 number.',
                  },
                  validate: (value: string) => {
                    if (value !== newPassword) {
                      return "Confirm password doesn't match";
                    }
                    return true;
                  },
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="text"
                type="button"
                className="text-text-muted! hover:text-red-500!"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                Change Password
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
};

export default ChangePasswordForm;
