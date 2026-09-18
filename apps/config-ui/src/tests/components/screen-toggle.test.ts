import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import ScreenToggle from '../../components/screen-toggle';

describe('ScreenToggle', () => {
  it('shows preview controls when Homebridge is unavailable', () => {
    expect(renderToStaticMarkup(React.createElement(ScreenToggle, {
      children: 'Preview content',
      homebridge: undefined,
      setView: vi.fn(),
      view: 'setup',
    }))).toContain('ADT Pulse for Homebridge');

    return;
  });

  it('renders only the content inside Homebridge', () => {
    expect(renderToStaticMarkup(React.createElement(ScreenToggle, {
      children: 'Homebridge content',
      homebridge: Object.create(null),
      setView: vi.fn(),
      view: 'setup',
    }))).toBe('Homebridge content');

    return;
  });

  return;
});
