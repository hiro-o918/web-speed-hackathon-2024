import { useSetAtom } from 'jotai';
import React, { useId, lazy, Suspense } from 'react';
import styled from 'styled-components';

import { DialogContentAtom } from '../atoms/DialogContentAtom';
import { Color, Space } from '../styles/variables';

// Lazy load dialog components
const TermDialog = lazy(() => import('./dialogs/TermDialog').then(module => ({ default: module.TermDialog })));
const ContactDialog = lazy(() => import('./dialogs/ContactDialog').then(module => ({ default: module.ContactDialog })));
const QuestionDialog = lazy(() => import('./dialogs/QuestionDialog').then(module => ({ default: module.QuestionDialog })));
const CompanyDialog = lazy(() => import('./dialogs/CompanyDialog').then(module => ({ default: module.CompanyDialog })));
const OverviewDialog = lazy(() => import('./dialogs/OverviewDialog').then(module => ({ default: module.OverviewDialog })));

import { Box } from './Box';
import { Button } from './Button';
import { Flex } from './Flex';
import { Spacer } from './Spacer';
import { Text } from './Text';

const _Button = styled(Button)`
  color: ${Color.MONO_A};
`;

// Placeholder component for suspense
const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Color.MONO_100};
`;

export const Footer: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const termDialogA11yId = useId();
  const contactDialogA11yId = useId();
  const questionDialogA11yId = useId();
  const companyDialogA11yId = useId();
  const overviewDialogA11yId = useId();

  const updateDialogContent = useSetAtom(DialogContentAtom);

  const handleRequestToTermDialogOpen = () => {
    updateDialogContent(
      <Suspense fallback={<LoadingPlaceholder>読み込み中...</LoadingPlaceholder>}>
        <TermDialog a11yId={termDialogA11yId} />
      </Suspense>
    );
  };

  const handleRequestToContactDialogOpen = () => {
    updateDialogContent(
      <Suspense fallback={<LoadingPlaceholder>読み込み中...</LoadingPlaceholder>}>
        <ContactDialog a11yId={contactDialogA11yId} />
      </Suspense>
    );
  };

  const handleRequestToQuestionDialogOpen = () => {
    updateDialogContent(
      <Suspense fallback={<LoadingPlaceholder>読み込み中...</LoadingPlaceholder>}>
        <QuestionDialog a11yId={questionDialogA11yId} />
      </Suspense>
    );
  };

  const handleRequestToCompanyDialogOpen = () => {
    updateDialogContent(
      <Suspense fallback={<LoadingPlaceholder>読み込み中...</LoadingPlaceholder>}>
        <CompanyDialog a11yId={companyDialogA11yId} />
      </Suspense>
    );
  };

  const handleRequestToOverviewDialogOpen = () => {
    updateDialogContent(
      <Suspense fallback={<LoadingPlaceholder>読み込み中...</LoadingPlaceholder>}>
        <OverviewDialog a11yId={overviewDialogA11yId} />
      </Suspense>
    );
  };

  return (
    <Box as="footer" backgroundColor={Color.Background} p={Space * 1}>
      <Flex align="flex-start" direction="column" gap={Space * 1} justify="flex-start">
        <img alt="Cyber TOON" src="/assets/cyber-toon.svg" />
        <Flex align="start" direction="row" gap={Space * 1.5} justify="center">
          <_Button disabled={!isClient} onClick={handleRequestToTermDialogOpen}>
            利用規約
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToContactDialogOpen}>
            お問い合わせ
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToQuestionDialogOpen}>
            Q&A
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToCompanyDialogOpen}>
            運営会社
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToOverviewDialogOpen}>
            Cyber TOONとは
          </_Button>
        </Flex>
      </Flex>
    </Box>
  );
};
