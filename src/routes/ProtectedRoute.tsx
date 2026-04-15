import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '.';
import { useLoading } from '../hooks/useLoading';
import { useMeQuery } from '../services/user.service';

interface IProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: IProps) => {
  const navigate = useNavigate();

  const { isLoading, error } = useMeQuery();
  const { show, hide } = useLoading();
  useEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }

    if (error) {
      navigate(ROUTES.SIGN_IN);
    }
  }, [isLoading]);

  return children;
};

export default ProtectedRoute;
