import { render, within, fireEvent, waitFor, screen } from '@testing-library/react';
import moment from 'moment';
import { MockedProvider } from '@apollo/client/testing';

import { TIME_FORMAT } from 'common/constants';
import { UPDATE_MESSAGE_TAGS } from 'graphql/mutations/Chat';
import ChatMessage from './ChatMessage';

let resultReturned = false;

const mocks = [
  {
    request: {
      query: UPDATE_MESSAGE_TAGS,
      variables: {
        input: {
          messageId: 1,
          addTagIds: [],
          deleteTagIds: ['1'],
        },
      },
    },
    result() {
      resultReturned = true;
      return {
        data: {
          messageTags: [],
        },
      };
    },
  },
];

const insertedAt = '2020-06-19T18:44:02Z';
const Props: any = (link: any) => {
  return {
    id: 1,
    body: '*Hello there!* visit https://www.google.com',
    contactId: 2,
    receiver: {
      id: 1,
    },
    sender: {
      id: 2,
    },
    showMessage: true,
    popup: 1,
    open: true,
    insertedAt,
    tags: [
      {
        id: 1,
        label: 'important',
      },
    ],
    type: link,
    media: { url: 'http://glific.com' },
    errors: '{}',
    contextMessage: {
      body: '*All good* https://www.google.com',
      contextId: 1,
      messageNumber: 10,
      errors: '{}',
      media: null,
      type: 'TEXT',
      insertedAt: '2021-04-26T06:13:03.832721Z',
      location: null,
      receiver: {
        id: '1',
      },
      sender: {
        id: '2',
        name: 'User',
      },
    },
    jumpToMessage: Function,
    focus: true,
    interactiveContent: '{}',
  };
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('<ChatMessage />', () => {
  const chatMessage = (type: any) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ChatMessage {...Props(type)} />
    </MockedProvider>
  );

  const chatMessageText = chatMessage('TEXT');

  test('it should render the message content correctly', () => {
    const { getByTestId } = render(chatMessageText);
    expect(getByTestId('content').textContent).toContain(
      'Hello there! visit https://www.google.com'
    );
  });

  test('it should apply the correct styling', () => {
    const { getByTestId } = render(chatMessageText);
    expect(getByTestId('content').innerHTML.includes('<b>Hello there!</b>')).toBe(true);
  });

  test('it should render the message date  correctly', () => {
    const { getByTestId } = render(chatMessageText);
    expect(getByTestId('date')).toHaveTextContent(moment(insertedAt).format(TIME_FORMAT));
  });

  test('it should render "Other" class for the content', () => {
    const { container } = render(chatMessageText);
    expect(container.querySelector('.Other')).toBeInTheDocument();
  });

  test('it should render the tags correctly', () => {
    const { getByTestId } = render(chatMessageText);
    const tags = within(getByTestId('tags'));
    expect(tags.getByText('important')).toBeInTheDocument();
  });

  test('it should render the down arrow icon', () => {
    const { getAllByTestId } = render(chatMessageText);
    expect(getAllByTestId('messageOptions')[0]).toBeInTheDocument();
  });

  test('it should render popup', async () => {
    const { getAllByTestId } = render(chatMessageText);
    expect(getAllByTestId('popup')[0]).toBeInTheDocument();
  });

  test('click on delete icon should call the delete query', async () => {
    const { getAllByTestId } = render(chatMessageText);
    fireEvent.click(getAllByTestId('deleteIcon')[0]);
    await waitFor(() => {
      expect(resultReturned).toBe(true);
    });
  });

  test('it should detect a link in message', async () => {
    const { getAllByTestId } = render(chatMessageText);
    expect(getAllByTestId('messageLink')[0].getAttribute('href')).toBe('https://www.google.com');
  });

  const chatMessageVideo = chatMessage('VIDEO');

  test('it should show the download media option when clicked on down arrow and message type is video', async () => {
    const { getAllByTestId } = render(chatMessageVideo);
    fireEvent.click(getAllByTestId('popup')[0]);
    expect(getAllByTestId('downloadMedia')[0]).toBeVisible();

    // For download video
    const download = getAllByTestId('downloadMedia')[0];
    expect(download).toBeVisible();

    await waitFor(() => {
      fireEvent.click(download);
    });
  });

  const chatMessageAudio = chatMessage('AUDIO');

  test('it should show the download media option when clicked on down arrow and message type is audio', async () => {
    const { getAllByTestId } = render(chatMessageAudio);
    fireEvent.click(getAllByTestId('popup')[0]);
    expect(getAllByTestId('downloadMedia')[0]).toBeVisible();

    // For download audio
    const download = getAllByTestId('downloadMedia')[0];
    expect(download).toBeVisible();

    await waitFor(() => {
      fireEvent.click(download);
    });
  });

  const chatMessageImage = chatMessage('IMAGE');

  test('it should show the download media option when clicked on down arrow and message type is image', async () => {
    const { getAllByTestId } = render(chatMessageImage);
    fireEvent.click(getAllByTestId('popup')[0]);
    expect(getAllByTestId('downloadMedia')[0]).toBeVisible();

    // For download image
    const download = getAllByTestId('downloadMedia')[0];
    expect(download).toBeVisible();

    await waitFor(() => {
      fireEvent.click(download);
    });
  });

  const chatMessageDoc = chatMessage('DOCUMENT');

  test('it should show the download media option when clicked on down arrow and message type is document', async () => {
    const { getAllByTestId, getAllByText } = render(chatMessageDoc);
    fireEvent.click(getAllByTestId('popup')[0]);

    // for speedsend
    const speedSend = getAllByText('Add to speed sends');
    expect(speedSend[0]).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(speedSend[0]);
    });

    // For download document
    const download = getAllByTestId('downloadMedia')[0];
    expect(download).toBeVisible();

    await waitFor(() => {
      fireEvent.click(download);
    });
  });

  test('it should click on replied message', async () => {
    const { getByTestId } = render(chatMessageDoc);
    await waitFor(() => {
      fireEvent.click(getByTestId('reply-message'));
    });
  });

  const props = Props('TEXT');
  test('it should render error with payload', async () => {
    props.errors = '{"payload": {"payload": {"reason": "Something went wrong"}}} ';
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...props} />
      </MockedProvider>
    );

    const errors = screen.getAllByTestId('tooltip');
    expect(errors[0]).toHaveTextContent('Warning.svg');
  });

  const imageProps = Props('DOCUMENT');
  test('it should render error with message', () => {
    imageProps.media = {
      url: 'https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf',
      caption: 'test',
    };
    imageProps.errors = '{"message": ["Something went wrong"]}';

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...imageProps} />
      </MockedProvider>
    );
  });

  test('it should render error with error message', () => {
    props.errors = '{"error": "Something went wrong"}';
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...props} />
      </MockedProvider>
    );

    const errors = screen.getAllByTestId('tooltip');
    expect(errors[0]).toHaveTextContent('Warning.svg');
  });

  const receivedProps = {
    id: '93',
    body: null,
    insertedAt: '2021-05-25T14:09:43.623251Z',
    messageNumber: 2,
    receiver: {
      id: '4',
    },
    sender: {
      id: '1',
    },
    location: null,
    tags: [],
    type: 'IMAGE',
    media: {
      url: 'https://i.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY',
      caption: '\n',
    },
    errors: '{}',
    contextMessage: null,
    contactId: '4',
    popup: true,
    focus: true,
    showMessage: true,
    interactiveContent: '{}',
  };

  test('it should render with image', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...receivedProps} />
      </MockedProvider>
    );
    const messageMenu = screen.getByTestId('messageOptions');

    await waitFor(() => {});

    expect(messageMenu).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.mouseDown(messageMenu);
    });
  });

  const quickReplyTemplate = {
    type: 'quick_reply',
    content: {
      type: 'image',
      url: 'https://picsum.photos/200/300',
      caption: 'body text',
    },
    options: [
      {
        type: 'text',
        title: 'First',
      },
      {
        type: 'text',
        title: 'Second',
      },
      {
        type: 'text',
        title: 'Third',
      },
    ],
  };

  const listTemplate = {
    type: 'list',
    title: 'title text',
    body: 'body text',
    globalButtons: [
      {
        type: 'text',
        title: 'button text',
      },
    ],
    items: [
      {
        title: 'first Section',
        subtitle: 'first Subtitle',
        options: [
          {
            type: 'text',
            title: 'section 1 row 1',
            description: 'first row of first section desctiption',
          },
        ],
      },
    ],
  };

  test('it should render with quick reply interactive template', async () => {
    receivedProps.interactiveContent = JSON.stringify(quickReplyTemplate);
    receivedProps.type = 'QUICK_REPLY';

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...receivedProps} />
      </MockedProvider>
    );
  });

  test('it should render with list interactive template', async () => {
    receivedProps.interactiveContent = JSON.stringify(listTemplate);
    receivedProps.type = 'LIST';

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatMessage {...receivedProps} />
      </MockedProvider>
    );
  });
});
