import { useLoading } from './useLoading';

export const useMutationHandler = () => {
  const { show, hide } = useLoading();
  const handle = async (promise: any, { onSuccess, onError, hasLoading = true }) => {
    try {
      if (hasLoading) {
        show();
      }
      const res = await promise.unwrap();
      onSuccess && onSuccess(res);
    } catch (error) {
      onError && onError(error.data);
      return null;
    } finally {
      hide();
    }
  };
  return { handle };
};
