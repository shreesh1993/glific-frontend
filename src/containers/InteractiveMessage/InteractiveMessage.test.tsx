import { render, cleanup, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import axios from 'axios';

import { setUserSession } from 'services/AuthService';
import { mocks } from 'mocks/InteractiveMessage';
import { InteractiveMessage } from './InteractiveMessage';

afterEach(cleanup);
setUserSession(JSON.stringify({ organization: { id: '1' }, roles: ['Admin'] }));

jest.mock('axios', () => {
  return {
    get: jest.fn(),
  };
});

jest.setTimeout(10000);

const responseMock1 = {
  results: [{ key: 'key 1' }, { key: 'key 2' }],
};

const responseMock2 = {
  types: [{ name: 'contact', properties: [{ key: 'key 1' }, { key: 'key 2' }] }],
};

const responseMock3 = {
  data: { is_valid: true },
};

const axiosApiCall = async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: responseMock1 }));

  axios.get.mockImplementationOnce(() => Promise.resolve({ data: responseMock2 }));
};

const whenStable = async () => {
  await waitFor(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

test('it renders empty interactive form', async () => {
  axiosApiCall();

  render(
    <MockedProvider mocks={[...mocks]} addTypename={false}>
      <InteractiveMessage match={{ params: {} }} />
    </MockedProvider>
  );

  // Getting contact variables
  jest.spyOn(axios, 'get').mockResolvedValueOnce(responseMock1);
  await whenStable();

  // Adding another quick reply button
  await waitFor(() => {
    const addQuickReplyButton = screen.getByText('Add quick reply');
    expect(addQuickReplyButton).toBeInTheDocument();
    fireEvent.click(addQuickReplyButton);
  });

  await waitFor(() => {
    // Get all input elements
    const [title, quickReply1, quickReply2, , attachmentUrl] = screen.getAllByRole('textbox');
    expect(title).toBeInTheDocument();
    expect(quickReply1).toBeInTheDocument();
    expect(quickReply2).toBeInTheDocument();
    expect(attachmentUrl).toBeInTheDocument();

    fireEvent.change(title, { target: { value: 'new title' } });
    fireEvent.blur(title);
    fireEvent.change(quickReply1, { target: { value: 'Yes' } });
    fireEvent.change(quickReply2, { target: { value: 'No' } });
    fireEvent.change(attachmentUrl, { target: { value: 'https://picsum.photos/200/300' } });
    fireEvent.blur(attachmentUrl);
  });

  // Changing language to marathi
  await waitFor(() => {
    const language = screen.getByText('Marathi');
    expect(language).toBeInTheDocument();

    fireEvent.click(language);
  });

  await waitFor(() => {
    const [attachmentType] = screen.getAllByTestId('autocomplete-element');

    expect(attachmentType).toBeInTheDocument();

    attachmentType.focus();
    fireEvent.keyDown(attachmentType, { key: 'ArrowDown' });
    fireEvent.keyDown(attachmentType, { key: 'Enter' });
  });

  // Switiching between radio buttons
  const [quickReplyRadio, listRadio] = screen.getAllByRole('radio');
  await waitFor(() => {
    expect(quickReplyRadio).toBeInTheDocument();
    expect(listRadio).toBeInTheDocument();
    fireEvent.click(listRadio);
  });

  await waitFor(() => {
    // Adding list data
    const [, header, listTitle, listItemTitle, listItemDesc] = screen.getAllByRole('textbox');
    expect(header).toBeInTheDocument();
    expect(listTitle).toBeInTheDocument();
    expect(listItemTitle).toBeInTheDocument();
    expect(listItemDesc).toBeInTheDocument();

    fireEvent.change(header, { target: { value: 'Section 1' } });
    fireEvent.blur(header);
    fireEvent.change(listTitle, { target: { value: 'title' } });
    fireEvent.change(listItemTitle, { target: { value: 'red' } });
    fireEvent.change(listItemDesc, { target: { value: 'red is color' } });
  });

  await waitFor(() => {
    // Adding another list item
    const addAnotherListItemButton = screen.getByText('Add another list item');
    expect(addAnotherListItemButton);
    fireEvent.click(addAnotherListItemButton);
  });

  await waitFor(() => {
    // Adding another list
    const addAnotherListButton = screen.getByText('Add another list');
    expect(addAnotherListButton);
    fireEvent.click(addAnotherListButton);
  });

  await waitFor(() => {
    // Deleting list
    const deleteListButton = screen.getByText('Dark.svg');
    expect(deleteListButton).toBeInTheDocument();
    fireEvent.click(deleteListButton);
  });

  await waitFor(() => {
    // Deleting list item
    const deleteListItemButton = screen.getByText('Cross.svg');
    expect(deleteListItemButton).toBeInTheDocument();
    fireEvent.click(deleteListItemButton);
  });

  // Switching back to quick reply radio
  fireEvent.click(quickReplyRadio);

  await waitFor(() => {
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
  });

  // TODOS: need to fix below
  // // succesful save
  // await waitFor(() => {
  //   expect(screen.getByText('Interactive created successfully!')).toBeInTheDocument();
  // });
});

test('it renders interactive quick reply in edit mode', async () => {
  axiosApiCall();

  const { container } = render(
    <MockedProvider mocks={[...mocks]} addTypename={false}>
      <InteractiveMessage match={{ params: { id: '1' } }} />
    </MockedProvider>
  );

  jest.spyOn(axios, 'get').mockResolvedValueOnce(responseMock1);
  await whenStable();

  await waitFor(() => {
    // Changing language to marathi to see translations
    const marathi = screen.getByText('Marathi');
    fireEvent.click(marathi);
  });

  await waitFor(() => {
    // Changing back to English
    const english = screen.getByText('English');
    fireEvent.click(english);
  });

  await waitFor(() => {
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
  });
});

test('it renders interactive list in edit mode', async () => {
  axiosApiCall();

  render(
    <MockedProvider mocks={[...mocks]} addTypename={false}>
      <InteractiveMessage match={{ params: { id: '2' } }} />
    </MockedProvider>
  );

  jest.spyOn(axios, 'get').mockResolvedValueOnce(responseMock1);
  await whenStable();

  await waitFor(() => {
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
  });
});

test('it renders interactive quick reply with media in edit mode', async () => {
  axiosApiCall();

  render(
    <MockedProvider mocks={[...mocks]} addTypename={false}>
      <InteractiveMessage match={{ params: { id: '3' } }} />
    </MockedProvider>
  );

  jest.spyOn(axios, 'get').mockResolvedValueOnce(responseMock3);
  await whenStable();
});
