import AuthLayout from '../layouts/AuthLayout';
import BoardLayout from '../layouts/BoardLayout';
import MainLayout from '../layouts/MainLayout';
import ConfirmPage from '../pages/auth/ConfirmPage';
import SignInPage from '../pages/auth/SignInPage';
import SignUpPage from '../pages/auth/SignUpPage';
import Board from '../pages/board/Board';
import Dashboard from '../pages/dashboard/Dashboard';
import WorkspaceBoardPage from '../pages/workspace/WorkspaceBoardPage';
import WorkspaceMemberPage from '../pages/workspace/WorkspaceMemberPage';

export const DOMAIN_ROUTE = {
  DASHBOARD: '/dashboard',
  BOARD: '/board',
  WORKSPACE: '/workspace',
};

export const ROUTES = {
  SIGN_IN: '/',
  SIGN_UP: '/sign-up',
  CONFIRM: '/confirm',
  BOARD: `${DOMAIN_ROUTE.BOARD}/:id`,
  DASHBOARD: `${DOMAIN_ROUTE.DASHBOARD}`,
  WORKSPACE_BOARDS: `${DOMAIN_ROUTE.WORKSPACE}/:id/boards/:index`,
  WORKSPACE_MEMBERS: `${DOMAIN_ROUTE.WORKSPACE}/:id/members/:index`,
};

export const routes = [
  {
    path: ROUTES.SIGN_IN,
    component: SignInPage,
    layout: AuthLayout,
    isPrivate: false,
  },
  {
    path: ROUTES.SIGN_UP,
    component: SignUpPage,
    layout: AuthLayout,
    isPrivate: false,
  },
  {
    path: ROUTES.CONFIRM,
    component: ConfirmPage,
    layout: AuthLayout,
    isPrivate: false,
  },
  {
    path: ROUTES.DASHBOARD,
    component: Dashboard,
    layout: MainLayout,
    isPrivate: true,
  },
  {
    path: ROUTES.WORKSPACE_BOARDS,
    component: WorkspaceBoardPage,
    layout: MainLayout,
    isPrivate: true,
  },
  {
    path: ROUTES.WORKSPACE_MEMBERS,
    component: WorkspaceMemberPage,
    layout: MainLayout,
    isPrivate: true,
  },
  {
    path: ROUTES.BOARD,
    component: Board,
    layout: BoardLayout,
    isPrivate: true,
  },
];

export const buildRouteWithId = (path: string, id: string, index?: number) => {
  if (path.includes('index') && index !== undefined) {
    return path.replace(':id', id).replace(':index', index.toString());
  }
  return path.replace(':id', id);
};
