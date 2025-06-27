import React from 'react';
import styled from 'styled-components';

import { COMPANY } from '../../constants/Company';
import { Color, Space, Typography } from '../../styles/variables';
import { Spacer } from '../Spacer';
import { Text } from '../Text';

const Content = styled.section`
  white-space: pre-line;
`;

interface CompanyDialogProps {
  a11yId: string;
}

export const CompanyDialog: React.FC<CompanyDialogProps> = ({ a11yId }) => {
  return (
    <Content aria-labelledby={a11yId} role="dialog">
      <Text as="h2" color={Color.MONO_100} id={a11yId} typography={Typography.NORMAL16}>
        運営会社
      </Text>
      <Spacer height={Space * 1} />
      <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
        {COMPANY}
      </Text>
    </Content>
  );
};