import type { Preview } from '@storybook/react';
import React from 'react';
import { cssVarsLight } from '@gradios/design-tokens/css-vars';
import './preview.css';

const cssVarsString = cssVarsLight();

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'base',
      values: [
        { name: 'base', value: '#FFFFFF' },
        { name: 'subtle', value: '#F5F5F7' },
        { name: 'inverse', value: '#1D1D1F' },
      ],
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Tokens',
          ['Color', 'Typography', 'Spacing', 'Radius', 'Shadow', 'Motion'],
          'Components',
          [
            'Button',
            'Card',
            'Badge',
            'Input',
            'Textarea',
            'Heading',
            'Text',
            'Section',
            'Container',
            'Dialog',
            'Sheet',
            'Tabs',
            'Accordion',
            'Skeleton',
          ],
          'Examples',
          ['Landing'],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <style dangerouslySetInnerHTML={{ __html: cssVarsString }} />
        <Story />
      </>
    ),
  ],
};

export default preview;
