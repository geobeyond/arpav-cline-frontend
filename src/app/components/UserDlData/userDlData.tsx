import React, { useEffect } from 'react';
import {
  Box,
  Radio,
  FormControlLabel,
  FormLabel,
  TextField as TextFieldMui,
  useMediaQuery,
  AutocompleteRenderInputParams,
  Link,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';
import {
  TextField,
  RadioGroup,
  CheckboxWithLabel,
  Autocomplete,
} from 'formik-mui';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  TextFieldSyle,
  FieldContainerStyle,
  UserDataContainerStyle,
} from './styles';
import { useSelector } from 'react-redux';

export interface UserDlDataProps {
  onValidityChange?: (isValid: boolean) => void;
  onChange?: (values: any) => void;
}

const UserDlData = (props: UserDlDataProps) => {
  const onValidityChange = props.onValidityChange ?? (() => {});
  const onChange = props.onChange ?? (() => {});

  enum Reason {
    Study = 'study',
    Inst = 'institutional',
    Comm = 'commercial',
    Other = 'other',
  }

  const initialValues =
    localStorage && typeof localStorage.getItem('user_form') === 'string'
      ? JSON.parse(localStorage.getItem('user_form') as string)
      : {
          // public: 0,
          membership: '',
          place: '',
          // reason: Reason.Study,
          other_reason: '',
          accept_disclaimer: false,
        };

  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const [otherDisabled, setOtherDisabled] = React.useState(true);
  const { cities } = useSelector((state: any) => state.map);

  const ValidityToken = () => {
    const { isValid } = useFormikContext();
    React.useEffect(() => {
      onValidityChange(isValid);
    }, [isValid]);
    return null;
  };

  useEffect(() => {
    onChange(initialValues);
  }, []);

  const handleChangeForm = event => {
    console.debug('Form change', event);
    const anyEvent: any = event;
    let values: any = {};
    if (anyEvent?.target?.name) {
      if (anyEvent?.target?.type === 'checkbox')
        values[`${anyEvent.target.name}`] = anyEvent?.target?.checked;
      else values[`${anyEvent.target.name}`] = anyEvent?.target?.value;
      if (anyEvent.target.name === 'reason')
        setOtherDisabled(anyEvent?.target?.value !== Reason.Other);
    }
    if (typeof localStorage.getItem('user_form') === 'string') {
      const localValues = JSON.parse(
        localStorage.getItem('user_form') as string,
      );

      const accept_disclaimer =
        typeof values['accept_disclaimer'] === 'boolean'
          ? values['accept_disclaimer']
          : localValues.accept_disclaimer === true;
      values = { ...localValues, ...values, accept_disclaimer };
    }
    localStorage.setItem('user_form', JSON.stringify(values));
    onChange(values);
  };

  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validateOnMount={true}
        validationSchema={Yup.object({
          reason: Yup.string().required(),
          public: Yup.boolean().required(),
          accept_disclaimer: Yup.boolean().oneOf(
            [true],
            t('app.map.downloadDataDialog.user.disclaimerReadError'),
          ),
        })}
        onSubmit={async v => {}}
      >
        {formikProps => (
          <Form onChange={handleChangeForm}>
            <Box sx={UserDataContainerStyle}>
              {/*<Box sx={FieldContainerStyle}>
                <Field
                  id="place"
                  name="place"
                  component={Autocomplete}
                  options={cities}
                  isOptionEqualToValue={(option, value) =>
                    option.label === value
                  }
                  onInputChange={(
                    event: React.SyntheticEvent,
                    value: string,
                    reason: string,
                  ) => {
                    const cEvent = {
                      target: {
                        name: 'place',
                        value: value,
                      },
                    };
                    handleChangeForm(cEvent);
                  }}
                  onChange={(event: React.SyntheticEvent, value: string) => {
                    formikProps.setFieldValue('place', value);
                  }}
                  // fullWidth
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextFieldMui
                      {...params}
                      name="place"
                      label={t('app.map.downloadDataDialog.user.aoi')}
                      variant="outlined"
                      sx={TextFieldSyle}
                    />
                  )}
                  size={isMobile ? 'small' : 'medium'}
                />
                </Box>*/}
              <Box sx={FieldContainerStyle}>
                <Field
                  id={'membership'}
                  name={'membership'}
                  type={'text'}
                  label={t('app.map.downloadDataDialog.user.membership')}
                  // required
                  component={TextField}
                  sx={TextFieldSyle}
                  // fullWidth
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
              <Box sx={FieldContainerStyle}>
                <FormLabel>
                  {t('app.map.downloadDataDialog.user.subject')}
                </FormLabel>
                <Field
                  component={RadioGroup}
                  id="public"
                  name="public"
                  size={isMobile ? 'small' : 'medium'}
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={t('app.map.downloadDataDialog.user.private')}
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t('app.map.downloadDataDialog.user.public')}
                  />
                </Field>
              </Box>
              <Box sx={FieldContainerStyle}>
                <FormLabel>
                  {t('app.map.downloadDataDialog.user.goal')}
                </FormLabel>
                <Field
                  component={RadioGroup}
                  id="reason"
                  name="reason"
                  size={isMobile ? 'small' : 'medium'}
                >
                  <FormControlLabel
                    value={Reason.Study}
                    control={<Radio />}
                    label={t('app.map.downloadDataDialog.user.study')}
                  />
                  <FormControlLabel
                    value={Reason.Inst}
                    control={<Radio />}
                    label={t('app.map.downloadDataDialog.user.institutional')}
                  />
                  <FormControlLabel
                    value={Reason.Comm}
                    control={<Radio />}
                    label={t('app.map.downloadDataDialog.user.commercial')}
                  />
                  <FormControlLabel
                    value={Reason.Other}
                    control={<Radio />}
                    label={
                      <Field
                        id={'other_reason'}
                        name={'other_reason'}
                        type={'text'}
                        component={TextField}
                        disabled={otherDisabled}
                        variant={'standard'}
                        placeholder={t('app.map.downloadDataDialog.user.other')}
                        size={isMobile ? 'small' : 'medium'}
                      />
                    }
                  />
                </Field>
              </Box>
            </Box>
            <Box sx={FieldContainerStyle}>
              <Typography variant={'body1'}>
                {t('app.map.downloadDataDialog.required')}
                <br />
              </Typography>
            </Box>
            <Box sx={FieldContainerStyle}>
              <MuiTextField
                InputProps={{ readOnly: true }}
                multiline
                label={t('app.map.downloadDataDialog.user.disclaimer')}
                defaultValue={t(
                  'app.map.downloadDataDialog.user.disclaimerText',
                )}
                fullWidth
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
            <Box sx={FieldContainerStyle}>
              <Field
                required
                id={'accept_disclaimer'}
                name={'accept_disclaimer'}
                type={'checkbox'}
                Label={{
                  label: t('app.map.downloadDataDialog.user.disclaimerRead'),
                }}
                component={CheckboxWithLabel}
                size={isMobile ? 'small' : 'medium'}
              />{' '}
              <Link href={'/data'} target={'_blank'}>
                Data policy
              </Link>{' '}
              -{' '}
              <Link href={'/info'} target={'_blank'}>
                {t('app.header.menu.info')}
              </Link>
            </Box>
            <ValidityToken />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserDlData;
