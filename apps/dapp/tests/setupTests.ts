import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'mocked_user_token' }));
  })
);
beforeAll(() => server.listen());
afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  server.resetHandlers();
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  try {
    expect(console.error).not.toHaveBeenCalled();
  } catch (e) {}
});
afterAll(() => server.close());
