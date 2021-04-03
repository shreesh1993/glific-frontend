import React, { lazy, Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

export const UnauthenticatedRoute: React.SFC = () => {
  const Login = lazy(() => import('../../containers/Auth/Login/Login'));
  const Registration = lazy(() => import('../../containers/Auth/Registration/Registration'));
  const ConfirmOTP = lazy(() => import('../../containers/Auth/ConfirmOTP/ConfirmOTP'));
  const ResetPasswordPhone = lazy(
    () => import('../../containers/Auth/ResetPassword/ResetPasswordPhone')
  );
  const ResetPasswordConfirmOTP = lazy(
    () => import('../../containers/Auth/ResetPassword/ResetPasswordConfirmOTP')
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/registration" exact component={Registration} />
        <Route path="/confirmotp" exact component={ConfirmOTP} />
        <Route path="/resetpassword-phone" exact component={ResetPasswordPhone} />
        <Route path="/resetpassword-confirmotp" exact component={ResetPasswordConfirmOTP} />
        <Route path="/" render={() => <Redirect to="/logout/user" />} />
      </Switch>
    </Suspense>
  );
};

export default UnauthenticatedRoute;
