const ThreadRepository = require('../ThreadRepository');

describe('threadRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
	// Arrange
	const threadRepository = new ThreadRepository();

	// Action & Assert
	await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	await expect(threadRepository.verifyThreadExists('')).rejects.toThrowError('THREAD_REPOSITORY.NOT_FOUND');
	await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});