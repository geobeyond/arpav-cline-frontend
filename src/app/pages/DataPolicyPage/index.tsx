import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import DataPolicyEn from './DataPolicyEn';
import DataPolicyIt from './DataPolicyIt';

const DataPolicyPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  return (
    <PageContainer>
      {i18n.language === 'it' ? <DataPolicyIt /> : <DataPolicyEn />}
    </PageContainer>
  );
};

export default DataPolicyPage;
