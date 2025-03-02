import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { collectionCountQuery, savedSearchQueryError, savedSearchStatusQuery } from 'mocks/Chat';
import { collectionCountSubscription } from 'mocks/Search';
import { setUserSession } from 'services/AuthService';
import SavedSearchToolbar from './SavedSearchToolbar';

const mocks = [savedSearchStatusQuery, collectionCountSubscription, collectionCountQuery];

describe('testing <SavedSearchToolbar />', () => {
  const defaultProps = {
    savedSearchCriteriaCallback: jest.fn,
    refetchData: { savedSearchCollection: null },
    onSelect: jest.fn,
  };

  setUserSession(JSON.stringify({ organization: { id: '1' }, roles: ['Admin'] }));

  const savedSearchToolbar = (
    <MockedProvider mocks={mocks} addTypename={false}>
      <SavedSearchToolbar {...defaultProps} />
    </MockedProvider>
  );

  test('it should render <SavedSearchToolbar /> component correctly', async () => {
    const { getByText, container } = render(savedSearchToolbar);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      // check if Unread Saved search is rendered
      const unreadButton: any = getByText('Unread');
      expect(unreadButton).toBeInTheDocument();

      // simulate saves search is selected
      fireEvent.click(unreadButton);
    });

    expect(container.querySelector('.SavedSearchItemSelected')).toBeInTheDocument();
  });

  test('it should render additional status', async () => {
    const { getByText, getByRole } = render(savedSearchToolbar);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      const moreStatus: any = getByRole('button');
      expect(moreStatus).toBeInTheDocument();
      fireEvent.click(moreStatus);
    });
  });

  test('click on additional status', async () => {
    const { getByText, getByRole, container } = render(savedSearchToolbar);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {});
    const moreStatus: any = getByRole('button');
    fireEvent.click(moreStatus);

    await waitFor(() => {});

    const optin: any = getByText('Optin');
    expect(optin).toBeInTheDocument();
    fireEvent.click(optin);

    await waitFor(() => {});
  });

  test('check if savedSearch query return error', async () => {
    const savedSearchToolbar = (
      <MockedProvider
        mocks={[savedSearchQueryError, collectionCountSubscription, collectionCountQuery]}
      >
        <SavedSearchToolbar {...defaultProps} />
      </MockedProvider>
    );
    const { getByText } = render(savedSearchToolbar);

    await waitFor(() => {
      getByText('error');
    });
  });
});
