import { Redirect, Route, RouteProps } from 'react-router-dom';

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
} & RouteProps;

export default function PrivateRoute({
  isAuthenticated,
  authenticationPath,
  ...routeProps
}: ProtectedRouteProps) {
  if (isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
}
