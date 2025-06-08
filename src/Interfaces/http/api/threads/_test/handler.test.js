const AddThreadUseCase = require('../../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../../Applications/use_case/GetThreadUseCase');
const ThreadsHandler = require('../handler');
const Container = require('../../../../../Infrastructures/container');

describe('ThreadsHandler', () => {
  describe('postThreadHandler', () => {
    it('should handle POST /threads correctly', async () => {
      // Arrange
      const requestPayload = {
        title: 'A Thread',
        body: 'Thread body content',
      };
      const mockAddedThread = {
        id: 'thread-123',
        title: 'A Thread',
        owner: 'user-123',
      };

      const mockAddThreadUseCase = {
        execute: jest.fn().mockResolvedValue(mockAddedThread),
      };

      const container = {
        getInstance: jest.fn().mockReturnValue(mockAddThreadUseCase),
      };

      const handler = new ThreadsHandler(container);

      const request = {
        payload: requestPayload,
        auth: {
          credentials: {
            id: 'user-123',
          },
        },
      };

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
      };

      // Act
      await handler.postThreadHandler(request, h);

      // Assert
      expect(container.getInstance).toBeCalledWith(AddThreadUseCase.name);
      expect(mockAddThreadUseCase.execute).toBeCalledWith({
        ...requestPayload,
        owner: request.auth.credentials.id,
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
        data: {
          addedThread: mockAddedThread,
        },
      });
      expect(h.code).toBeCalledWith(201);
    });
  });

  describe('getThreadHandler', () => {
    it('should handle GET /threads/{threadId} correctly', async () => {
      // Arrange
      const requestParams = {
        threadId: 'thread-123',
      };
      const mockThread = {
        id: 'thread-123',
        title: 'A Thread',
        body: 'Thread body content',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [],
      };

      const mockGetThreadUseCase = {
        execute: jest.fn().mockResolvedValue(mockThread),
      };

      const container = {
        getInstance: jest.fn().mockReturnValue(mockGetThreadUseCase),
      };

      const handler = new ThreadsHandler(container);

      const request = {
        params: requestParams,
      };

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
      };

      // Act
      await handler.getThreadHandler(request, h);

      // Assert
      expect(container.getInstance).toBeCalledWith(GetThreadUseCase.name);
      expect(mockGetThreadUseCase.execute).toBeCalledWith({
        threadId: requestParams.threadId,
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
        data: {
          thread: mockThread,
        },
      });
      expect(h.code).toBeCalledWith(200);
    });
  });
});
