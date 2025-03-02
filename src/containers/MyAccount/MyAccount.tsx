import React, { useState } from 'react';
import * as Yup from 'yup';
import { Typography, IconButton } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ReactComponent as UserIcon } from 'assets/images/icons/Contact/Profile.svg';
import { UPDATE_CURRENT_USER } from 'graphql/mutations/User';
import { GET_CURRENT_USER } from 'graphql/queries/User';
import { USER_LANGUAGES } from 'graphql/queries/Organization';
import { Input } from 'components/UI/Form/Input/Input';
import { Button } from 'components/UI/Form/Button/Button';
import { Loading } from 'components/UI/Layout/Loading/Loading';
import { ToastMessage } from 'components/UI/ToastMessage/ToastMessage';
import { Dropdown } from 'components/UI/Form/Dropdown/Dropdown';
import { sendOTP } from 'services/AuthService';
import styles from './MyAccount.module.css';

export interface MyAccountProps {}

export const MyAccount: React.SFC<MyAccountProps> = () => {
  // set the validation / errors / success message
  const [toastMessageInfo, setToastMessageInfo] = useState({ message: '', severity: '' });

  // set the trigger to show next step
  const [showOTPButton, setShowOTPButton] = useState(true);

  // set redirection to chat
  const [redirectToChat, setRedirectToChat] = useState(false);

  // handle visibility for the password field
  const [showPassword, setShowPassword] = useState(false);

  // user language selection
  const [userLanguage, setUserLanguage] = useState('');

  const [message, setMessage] = useState<string>('');

  const client = useApolloClient();

  // get the information on current user
  const { data: userData, loading: userDataLoading } = useQuery(GET_CURRENT_USER);

  // get available languages for the logged in users organization
  const { data: organizationData, loading: organizationDataLoading } = useQuery(USER_LANGUAGES);

  const { t, i18n } = useTranslation();

  // set the mutation to update the logged in user password
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER, {
    onCompleted: (data) => {
      if (data.updateCurrentUser.errors) {
        if (data.updateCurrentUser.errors[0].message === 'incorrect_code') {
          setToastMessageInfo({ severity: 'error', message: t('Please enter a valid OTP') });
        } else {
          setToastMessageInfo({
            severity: 'error',
            message: t('Too many attempts, please retry after sometime.'),
          });
        }
      } else {
        setShowOTPButton(true);
        setToastMessageInfo({ severity: 'success', message });
      }
    },
  });

  // return loading till we fetch the data
  if (userDataLoading || organizationDataLoading) return <Loading />;

  // filter languages that support localization
  const languageOptions = organizationData.currentUser.user.organization.activeLanguages
    .filter((lang: any) => lang.localized)
    .map((lang: any) => {
      // restructure language array
      const lanObj = { id: lang.locale, label: lang.label };
      return lanObj;
    });

  // callback function to send otp to the logged user
  const sendOTPHandler = () => {
    // set the phone of logged in user that will be used to send the OTP
    const loggedInUserPhone = userData?.currentUser.user.phone;
    sendOTP(loggedInUserPhone)
      .then(() => {
        setShowOTPButton(false);
      })
      .catch(() => {
        setToastMessageInfo({
          severity: 'error',
          message: `Unable to send an OTP to ${loggedInUserPhone}.`,
        });
      });
  };

  // cancel handler if cancel is clicked
  const cancelHandler = () => {
    setRedirectToChat(true);
  };

  // save the form if data is valid
  const saveHandler = (item: any) => {
    setMessage(t('Password updated successfully!'));
    updateCurrentUser({
      variables: { input: item },
    });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // callback function when close icon is clicked
  const closeToastMessage = () => {
    // reset toast information
    setToastMessageInfo({ message: '', severity: '' });
  };

  // set up toast message display, we use this for showing backend validation errors like
  // invalid OTP and also display success message on password update
  let displayToastMessage: any;
  if (toastMessageInfo.message.length > 0) {
    displayToastMessage = (
      <ToastMessage
        message={toastMessageInfo.message}
        severity={toastMessageInfo.severity === 'success' ? 'success' : 'error'}
        handleClose={closeToastMessage}
      />
    );
  }

  // setup form schema base on Yup
  const FormSchema = Yup.object().shape({
    otp: Yup.string().required(t('Input required')),
    password: Yup.string()
      .min(6, t('Password must be at least 8 characters long.'))
      .required(t('Input required')),
  });

  // for configuration that needs to be rendered
  const formFields = [
    {
      component: Input,
      type: 'otp',
      name: 'otp',
      placeholder: 'OTP',
      helperText: t('Please confirm the OTP received at your WhatsApp number.'),
      endAdornmentCallback: sendOTPHandler,
    },
    {
      component: Input,
      name: 'password',
      type: 'password',
      placeholder: t('Change Password'),
      endAdornmentCallback: handlePasswordVisibility,
      togglePassword: showPassword,
    },
  ];

  // redirect to chat
  if (redirectToChat) {
    return <Redirect to="/chat" />;
  }

  // build form fields
  let formFieldLayout: any;
  if (!showOTPButton) {
    formFieldLayout = formFields.map((field: any, index) => {
      const key = index;
      return (
        <React.Fragment key={key}>
          <Field key={key} {...field} />
        </React.Fragment>
      );
    });
  }

  // form component
  const form = (
    <>
      <Formik
        enableReinitialize
        initialValues={{ otp: '', password: '' }}
        validationSchema={FormSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values);
          resetForm();
        }}
      >
        {({ submitForm }) => (
          <Form className={styles.Form}>
            {displayToastMessage}
            {formFieldLayout}
            <div className={styles.Buttons}>
              {showOTPButton ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendOTPHandler}
                    className={styles.Button}
                    data-testid="generateOTP"
                  >
                    {t('Generate OTP')}
                  </Button>
                  <div className={styles.HelperText}>
                    {t('To change first please generate OTP')}
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                    className={styles.Button}
                  >
                    {t('Save')}
                  </Button>
                  <Button variant="contained" color="default" onClick={cancelHandler}>
                    {t('Cancel')}
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );

  // set only for the first time
  if (!userLanguage && userData.currentUser.user.language) {
    setUserLanguage(userData.currentUser.user.language.locale);
  }

  const changeLanguage = (event: any) => {
    setUserLanguage(event.target.value);

    // change the user interface
    i18n.changeLanguage(event.target.value);

    // get language id
    const languageID = organizationData.currentUser.user.organization.activeLanguages.filter(
      (lang: any) => lang.locale === event.target.value
    );

    setMessage(t('Language changed successfully!'));
    // update user's language
    updateCurrentUser({
      variables: { input: { languageId: languageID[0].id } },
    });

    // writing cache to restore value
    const userDataCopy = JSON.parse(JSON.stringify(userData));
    const language = languageID[0];
    userDataCopy.currentUser.user.language = language;

    client.writeQuery({
      query: GET_CURRENT_USER,
      data: userDataCopy,
    });
  };

  const languageField = {
    onChange: changeLanguage,
    value: userLanguage,
  };

  const languageSwitcher = (
    <div className={styles.Form}>
      <Dropdown
        options={languageOptions}
        placeholder={t('Available languages')}
        field={languageField}
      />
    </div>
  );

  return (
    <div className={styles.MyAccount} data-testid="MyAccount">
      <Typography variant="h5" className={styles.Title}>
        <IconButton disabled className={styles.Icon}>
          <UserIcon />
        </IconButton>
        {t('My Account')}
      </Typography>
      <Typography variant="h6" className={styles.Title}>
        {t('Change Interface Language')}
      </Typography>
      {languageSwitcher}
      <Typography variant="h6" className={styles.Title}>
        {t('Change Password')}
      </Typography>
      {form}
    </div>
  );
};

export default MyAccount;
