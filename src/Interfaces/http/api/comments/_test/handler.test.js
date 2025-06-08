const AddThreadCommentUseCase = require('../../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../../Applications/use_case/DeleteThreadCommentUseCase');
const CommentHandler = require('../handler');
const Container = require('../../../../../Infrastructures/container');

describe('CommentHandler', () => {
  describe('postThreadCommentHandler', () => {
    it('should handle POST /threads/{threadId}/comments correctly', async () => {
      // Arrange
      const requestPayload = {
        content: 'A comment',
      };
      const requestParams = {
        threadId: 'thread-123',
      };
      const mockAddedComment = {
        id: 'comment-123',
        content: 'A comment',
        owner: 'user-123',
      };

      const mockAddThreadCommentUseCase = {
        execute: jest.fn().mockResolvedValue(mockAddedComment),
      };

      const container = {
        getInstance: jest.fn().mockReturnValue(mockAddThreadCommentUseCase),
      };

      const handler = new CommentHandler(container);

      const request = {
        payload: requestPayload,
        params: requestParams,
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
      await handler.postThreadCommentHandler(request, h);

      // Assert
      expect(container.getInstance).toBeCalledWith(AddThreadCommentUseCase.name);
      expect(mockAddThreadCommentUseCase.execute).toBeCalledWith({
        content: requestPayload.content,
        threadId: requestParams.threadId,
        owner: request.auth.credentials.id,
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
        data: {
          addedComment: mockAddedComment,
        },
      });
      expect(h.code).toBeCalledWith(201);
    });

    it('should handle error when addedComment is undefined', async () => {
      // Arrange
      const requestPayload = {
        content: 'A comment',
      };
      const requestParams = {
        threadId: 'thread-123',
      };

      const mockAddThreadCommentUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };

      const container = {
        getInstance: jest.fn().mockReturnValue(mockAddThreadCommentUseCase),
      };

      const handler = new CommentHandler(container);

      const request = {
        payload: requestPayload,
        params: requestParams,
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

      // Act & Assert
      await expect(handler.postThreadCommentHandler(request, h))
        .rejects
        .toThrow('tidak dapat membuat komentar karena tipe data tidak sesuai');
    });
  });

  describe('deleteThreadCommentHandler', () => {
    it('should handle DELETE /threads/{threadId}/comments/{commentId} correctly', async () => {
      // Arrange
      const requestParams = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const mockDeleteThreadCommentUseCase = {
        execute: jest.fn().mockResolvedValue(),
      };

      const container = {
        getInstance: jest.fn().mockReturnValue(mockDeleteThreadCommentUseCase),
      };

      const handler = new CommentHandler(container);

      const request = {
        params: requestParams,
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
      await handler.deleteThreadCommentHandler(request, h);

      // Assert
      expect(container.getInstance).toBeCalledWith(DeleteThreadCommentUseCase.name);
      expect(mockDeleteThreadCommentUseCase.execute).toBeCalledWith({
        threadId: requestParams.threadId,
        commentId: requestParams.commentId,
        ownerId: request.auth.credentials.id,
      });
      expect(h.response).toBeCalledWith({
        status: 'success',
      });
      expect(h.code).toBeCalledWith(200);
    });
  });
}); 