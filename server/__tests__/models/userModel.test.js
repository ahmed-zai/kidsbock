// server/__tests__/models/userModel.test.js
const userModel = require('../../models/userModel');

// Mock the global.db object
global.db = {
  query: jest.fn(),
};

describe('userModel', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: '123',
        full_name: 'Test User',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        role: 'user',
        plan_type: 'free',
      };
      global.db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const user = await userModel.findUserByEmail('test@example.com');
      expect(user).toEqual(mockUser);
      expect(global.db.query).toHaveBeenCalledTimes(1);
      expect(global.db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['test@example.com']
      );
    });

    it('should return null if no user is found', async () => {
      global.db.query.mockResolvedValueOnce({ rows: [] });

      const user = await userModel.findUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
      expect(global.db.query).toHaveBeenCalledTimes(1);
      expect(global.db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['nonexistent@example.com']
      );
    });
  });

  // Add more tests for other functions in userModel later
});
