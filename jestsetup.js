/* eslint-env browser */

// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;
