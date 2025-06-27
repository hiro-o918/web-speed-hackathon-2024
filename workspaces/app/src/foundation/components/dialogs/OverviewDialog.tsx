import React from 'react';
import styled from 'styled-components';

import { OVERVIEW } from '../../constants/Overview';
import { Color, Space, Typography } from '../../styles/variables';
import { Spacer } from '../Spacer';
import { Text } from '../Text';

const Content = styled.section`
  white-space: pre-line;
`;

interface OverviewDialogProps {
  a11yId: string;
}

export const OverviewDialog: React.FC<OverviewDialogProps> = ({ a11yId }) => {
  return (
    <Content aria-labelledby={a11yId} role="dialog">
      <Text as="h2" color={Color.MONO_100} id={a11yId} typography={Typography.NORMAL16}>
        Cyber TOONとは
      </Text>
      <Spacer height={Space * 1} />
      <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
        {OVERVIEW}
      </Text>
    </Content>
  );
};