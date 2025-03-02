import {
  CREATE_INTERACTIVE,
  DELETE_INTERACTIVE,
  UPDATE_INTERACTIVE,
} from 'graphql/mutations/InteractiveMessage';
import {
  FILTER_INTERACTIVE_MESSAGES,
  GET_INTERACTIVE_MESSAGES_COUNT,
  GET_INTERACTIVE_MESSAGE,
} from 'graphql/queries/InteractiveMessage';
import { getOrganizationLanguagesQueryByOrder } from './Organization';

const filterInteractiveFunction = (filter: any, opts: any) => ({
  request: {
    query: FILTER_INTERACTIVE_MESSAGES,
    variables: {
      filter,
      opts,
    },
  },
  result: {
    data: {
      interactiveTemplates: [
        {
          id: '1',
          label: 'list',
          type: 'LIST',
          translations:
            '{"1": {"body": "this is message", "type": "list", "items": [{"title": "list header 1", "options": [{"type": "text", "title": "red", "description": ""}, {"type": "text", "title": "blue", "description": ""}], "subtitle": "list header 1"}], "title": "Interactive list in english yay", "globalButtons": [{"type": "text", "title": "list"}]}, "2": {"body": "यह संदेश है ", "type": "list", "items": [{"title": "सूची शीर्षक १", "options": [{"type": "text", "title": "लाल", "description": ""}, {"type": "text", "title": "नीला", "description": ""}], "subtitle": "सूची शीर्षक १"}], "title": "इंटरेक्टिव लिस्ट हिंदी में", "globalButtons": [{"type": "text", "title": "सूची"}]}}',
          language: {
            id: '1',
            label: 'English',
          },
          interactiveContent:
            '{"body": "यह संदेश है ", "type": "list", "items": [{"title": "सूची शीर्षक १", "options": [{"type": "text", "title": "लाल", "description": ""}, {"type": "text", "title": "नीला", "description": ""}], "subtitle": "सूची शीर्षक १"}], "title": "इंटरेक्टिव लिस्ट हिंदी में", "globalButtons": [{"type": "text", "title": "सूची"}]}',
        },
        {
          id: '2',
          label: 'quick reply document',
          type: 'QUICK_REPLY',
          translations: '{}',
          language: {
            id: '1',
            label: 'English',
          },
          interactiveContent:
            '{"type":"quick_reply","options":[{"type":"text","title":"First"},{"type":"text","title":"Second"},{"type":"text","title":"Third"}],"content":{"url":"http://enterprise.smsgupshup.com/doc/GatewayAPIDoc.pdf","type":"file","filename":"Sample file"}}',
        },
        {
          id: '3',
          label: 'quick reply image',
          type: 'QUICK_REPLY',
          translations:
            '{"1": {"type": "quick_reply", "content": {"url": "https://picsum.photos/200/300", "type": "image", "caption": "body text"}, "options": [{"type": "text", "title": "First"}, {"type": "text", "title": "Second"}, {"type": "text", "title": "Third"}]}, "2": {"type": "quick_reply", "content": {"url": "https://i.picsum.photos/id/202/200/300.jpg?hmac=KWOdj8XRnO9x8h_I9rIbscSAhD1x-TwkSPPYjWLN2sI", "type": "image", "caption": "यह संदेश है."}, "options": [{"type": "text", "title": "पहला"}, {"type": "text", "title": "दूसरा"}, {"type": "text", "title": "थ्रिड"}]}}',
          language: {
            id: '1',
            label: 'English',
          },
          interactiveContent:
            '{"type": "quick_reply", "content": {"url": "https://picsum.photos/200/300", "type": "image", "caption": "body text"}, "options": [{"type": "text", "title": "First"}, {"type": "text", "title": "Second"}, {"type": "text", "title": "Third"}]}',
        },
        {
          id: '4',
          label: 'quick reply text',
          type: 'QUICK_REPLY',
          translations: '{}',
          language: {
            id: '1',
            label: 'English',
          },
          interactiveContent:
            '{"type":"quick_reply","options":[{"type":"text","title":"Excited"},{"type":"text","title":"Very Excited"}],"content":{"type":"text","text":"How excited are you for Glific?"}}',
        },
        {
          id: '5',
          label: 'quick reply video',
          type: 'QUICK_REPLY',
          translations: '{}',
          language: {
            id: '1',
            label: 'English',
          },
          interactiveContent:
            '{"type": "quick_reply", "content": {"url": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4", "type": "video", "caption": "Sample video"}, "options": [{"type": "text", "title": "First"}, {"type": "text", "title": "Second"}, {"type": "text", "title": "Third"}]}',
        },
      ],
    },
  },
});

export const filterInteractiveQuery = filterInteractiveFunction(
  {},
  {
    limit: 50,
    offset: 0,
    order: 'ASC',
    orderWith: 'label',
  }
);

export const searchInteractive = filterInteractiveFunction({ label: '' }, {});

export const getInteractiveCountQuery = {
  request: {
    query: GET_INTERACTIVE_MESSAGES_COUNT,
    variables: {
      filter: {},
    },
  },
  result: {
    data: {
      countInteractiveTemplates: 4,
    },
  },
};

const quickReplyMock = {
  interactiveContent:
    '{"type":"quick_reply","options":[{"type":"text","title":"Excited"},{"type":"text","title":"Very Excited"}],"content":{"type":"text","text":"How excited are you for Glific?"}}',
  label: 'A quick reply mock',
  type: 'QUICK_REPLY',
  translations:
    '{"1": {"type": "quick_reply", "content": {"text": "How excited are you for Glific?", "type": "text", "caption": "Glific is a two way communication platform"}, "options": [{"type": "text", "title": "Excited"}, {"type": "text", "title": "Very Excited"}]}, "2": {"type": "quick_reply", "content": {"text": "त्वरित उत्तर पाठ", "type": "text", "caption": "ग्लिफिक एक दोतरफा संचार मंच है"}, "options": [{"type": "text", "title": "उत्साहित"}, {"type": "text", "title": "बहुत उत्साहित"}]}}',
  language: {
    id: '1',
    label: 'English',
  },
};

const quickReplyMedia = {
  interactiveContent:
    '{"type": "quick_reply", "content": {"url": "https://picsum.photos/200/300", "type": "image", "caption": "body text"}, "options": [{"type": "text", "title": "First"}, {"type": "text", "title": "Second"}, {"type": "text", "title": "Third"}]}',
  label: 'A quick reply mock',
  type: 'QUICK_REPLY',
  translations:
    '{"1": {"type": "quick_reply", "content": {"url": "https://picsum.photos/200/300", "type": "image", "caption": "body text"}, "options": [{"type": "text", "title": "First"}, {"type": "text", "title": "Second"}, {"type": "text", "title": "Third"}]}, "2": {"type": "quick_reply", "content": {"url": "https://i.picsum.photos/id/202/200/300.jpg?hmac=KWOdj8XRnO9x8h_I9rIbscSAhD1x-TwkSPPYjWLN2sI", "type": "image", "caption": "यह संदेश है."}, "options": [{"type": "text", "title": "पहला"}, {"type": "text", "title": "दूसरा"}, {"type": "text", "title": "थ्रिड"}]}}',
  language: {
    id: '1',
    label: 'English',
  },
};

const listReplyMock = {
  label: 'list',
  type: 'LIST',
  translations: '{}',
  language: {
    id: '1',
    label: 'English',
  },
  interactiveContent:
    '{"type":"list","title":"Glific","items":[{"title":"Glific Features","subtitle":"first Subtitle","options":[{"type":"text","title":"Custom flows for automating conversation","description":"Flow Editor for creating flows"},{"type":"text","title":"Custom reports for  analytics","description":"DataStudio for report generation"},{"type":"text","title":"ML/AI","description":"Dialogflow for AI/ML"}]},{"title":"Glific Usecases","subtitle":"some usecases of Glific","options":[{"type":"text","title":"Educational programs","description":"Sharing education content with school student"}]},{"title":"Onboarded NGOs","subtitle":"List of NGOs onboarded","options":[{"type":"text","title":"SOL","description":"Slam Out Loud is an Indian for mission, non-profit that envisions that every individual will have a voice that empowers them to change lives."}]}],"globalButtons":[{"type":"text","title":"button text"}],"body":"Glific"}',
};

const createMockByType = (body: any) => ({
  request: {
    query: CREATE_INTERACTIVE,
    variables: {
      input: body,
    },
  },
  result: {
    data: {
      createInteractiveTemplate: {
        interactiveTemplate: body,
      },
      errors: null,
    },
  },
});

const updateMockByType = (id: string, input: any) => ({
  request: {
    query: UPDATE_INTERACTIVE,
    variables: {
      id,
      input,
    },
  },
  result: {
    data: {
      updateInteractiveTemplate: {
        interactiveTemplate: {
          id,
          insertedAt: '2021-07-14T11:12:42Z',
          updatedAt: '2021-07-14T11:26:00Z',
          ...input,
        },
      },
      errors: null,
    },
  },
});

const getTemplateByType = (id: string, body: any) => ({
  request: {
    query: GET_INTERACTIVE_MESSAGE,
    variables: {
      id,
    },
  },
  result: {
    data: {
      interactiveTemplate: {
        interactiveTemplate: {
          id,
          ...body,
        },
      },
    },
  },
});

const deleteMock = {
  request: {
    query: DELETE_INTERACTIVE,
    variables: {
      id: '1',
    },
  },
  result: {
    data: {
      deleteInteractiveTemplate: {
        errors: null,
      },
    },
  },
};

export const mocks: any = [
  createMockByType(quickReplyMock),
  createMockByType(listReplyMock),
  updateMockByType('1', quickReplyMock),
  updateMockByType('2', listReplyMock),
  getTemplateByType('1', quickReplyMock),
  getTemplateByType('2', listReplyMock),
  getTemplateByType('3', quickReplyMedia),
  deleteMock,
  getOrganizationLanguagesQueryByOrder,
];
