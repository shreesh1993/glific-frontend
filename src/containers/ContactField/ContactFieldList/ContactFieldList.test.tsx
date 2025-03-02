import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { setUserSession } from 'services/AuthService';
import { mocks, contactFieldErrorMock } from 'mocks/ContactFields';
import ContactFieldList from './ContactFieldList';

const props = {
  match: { params: {} },
  openDialog: false,
};

setUserSession(JSON.stringify({ organization: { id: '1' }, roles: ['Admin'] }));

const list = (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Router>
      <ContactFieldList {...props} />
    </Router>
  </MockedProvider>
);

test('it renders list successfully', async () => {
  render(list);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(async () => await new Promise((resolve) => setTimeout(resolve, 0)));

  const variableNameLabel = screen.getByText('VARIABLE NAME');
  const inputNameLabel = screen.getByText('INPUT NAME');
  const shortcodeLabel = screen.getByText('SHORTCODE');
  const actionLabel = screen.getByText('ACTIONS');

  expect(variableNameLabel).toBeInTheDocument();
  expect(inputNameLabel).toBeInTheDocument();
  expect(shortcodeLabel).toBeInTheDocument();
  expect(actionLabel).toBeInTheDocument();

  const editButtons = screen.getAllByRole('button', {
    name: 'GreenEdit.svg',
  });
  expect(editButtons[0]).toBeInTheDocument();
  fireEvent.click(editButtons[0]);

  await waitFor(() => {});
  // Edit, clears value and click save
  const inputFields = screen.getAllByRole('textbox');
  userEvent.type(inputFields[1], '{selectall}{backspace}');

  await waitFor(() => {});

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {});

  userEvent.type(inputFields[1], '{selectall}{backspace}Age Group Name');
  fireEvent.click(saveButton);

  await waitFor(() => {});
});

const errorMock: any = [...mocks];
errorMock.pop();
errorMock.push(contactFieldErrorMock);

const listError = (
  <MockedProvider mocks={errorMock}>
    <Router>
      <ContactFieldList {...props} />
    </Router>
  </MockedProvider>
);

test('it renders component, edits field, saves and error occurs', async () => {
  render(listError);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(async () => await new Promise((resolve) => setTimeout(resolve, 0)));

  const editButtons = screen.getAllByRole('button', {
    name: 'GreenEdit.svg',
  });
  expect(editButtons[3]).toBeInTheDocument();
  fireEvent.click(editButtons[3]);

  await waitFor(() => {});
  // Edit, clears value and click save
  const inputFields = screen.getAllByRole('textbox');
  userEvent.type(inputFields[1], '{selectall}{backspace}age_group');

  await waitFor(() => {});

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {});
});
