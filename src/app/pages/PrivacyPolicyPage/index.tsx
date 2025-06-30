import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/Modals/PageContainer';
import PrivacyPolicyEn from './PrivacyPolicyEn';
import PrivacyPolicyIt from './PrivacyPolicyIt';

const PrivacyPolicyPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <PageContainer>
      {i18n.language === 'it' ? <PrivacyPolicyIt /> : <PrivacyPolicyEn />}
    </PageContainer>
  );
};

export default PrivacyPolicyPage;
