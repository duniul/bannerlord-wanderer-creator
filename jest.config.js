import { configure } from '@testing-library/react';
import 'mutationobserver-shim';

configure({ testIdAttribute: 'data-test-id' });

afterEach(() => {
  jest.clearAllMocks();
});