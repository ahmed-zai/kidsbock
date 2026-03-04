// Set default env vars for tests
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
process.env.NODE_ENV = 'test';
process.env.PGHOST = 'localhost';
process.env.PGUSER = 'test';
process.env.PGDATABASE = 'test';
process.env.PGPASSWORD = 'test';
process.env.PGPORT = '5432';

// Mock pg globally
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: jest.fn(),
    }),
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock userModel globally for middleware
jest.mock('./models/userModel', () => ({
  getUserById: jest.fn(async (id) => ({ id, role: id.includes('admin') ? 'admin' : 'parent' })),
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  updateUserPlan: jest.fn(),
}));
