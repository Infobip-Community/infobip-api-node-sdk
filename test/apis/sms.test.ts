import { SMS } from '../../src/apis/sms';
import {
  basicTextMessage,
  previewMessage,
  sendQueryMessage,
} from '../fixtures/sms';
import axios from 'axios';

jest.mock('axios');

beforeAll(() => {
  (axios as any).create.mockReturnThis();
});

const BASE_URL = 'https://example.org';
const USERNAME = 'infobip';
const PASSWORD = 's3cr3t';

describe('SMS', () => {
  it('sending will throw an error when method parameters are wrong', async () => {
    expect.assertions(1);
    (axios as any).post.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    let error: Error = (await sms.send(1)) as Error;

    expect(error).toBeInstanceOf(Error);
  });

  it('sending will throw an error when the message type is unsupported', async () => {
    expect.assertions(1);
    (axios as any).post.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    let error: Error = (await sms.send({ type: 'something' })) as Error;

    expect(error.message).toEqual(
      'Invalid message type something. Supported types are: text, binary, query.'
    );
  });

  it('can send a text message', async () => {
    expect.assertions(1);
    (axios as any).post.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    await sms.send(basicTextMessage);

    expect(axios.post).toHaveBeenCalledWith(
      '/sms/2/text/advanced',
      basicTextMessage,
      undefined
    );
  });

  it('can send a query text message', async () => {
    expect.assertions(1);
    (axios as any).post.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });

    await sms.send(sendQueryMessage);

    expect(axios.get).toHaveBeenCalledWith('/sms/1/text/query', {
      params: {
        password: 's3cr3t',
        to: '41793026727,41793026728,41793026729',
        type: 'query',
        username: 'infobip',
      },
    });
  });

  it('can preview a text message', async () => {
    expect.assertions(1);
    (axios as any).post.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    await sms.preview(previewMessage);

    expect(axios.post).toHaveBeenCalledWith(
      '/sms/1/preview',
      previewMessage,
      undefined
    );
  });

  it('will throw an error when preivewing a text message fails', async () => {
    expect.assertions(1);
    (axios as any).post.mockRejectedValue({ message: 'error' });

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });

    let error = await sms.preview(previewMessage);
    expect(error).toEqual({ message: 'error' });
  });

  it('will throw an error when getting SMS messages fails', async () => {
    expect.assertions(1);
    (axios as any).get.mockRejectedValue({ message: 'error' });

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });

    let error = await sms.get();
    expect(error).toEqual({ message: 'error' });
  });

  it('can get SMS messages', async () => {
    expect.assertions(1);
    (axios as any).get.mockResolvedValue({});

    let sms = new SMS({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    await sms.get();

    expect(axios.get).toHaveBeenCalledWith('/sms/1/inbox/reports', {
      params: { limit: undefined },
    });
  });
});
