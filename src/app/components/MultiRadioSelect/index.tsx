import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import ExitIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  InputLabel,
} from '@mui/material';
import {
  MultiRadioSelectMenuStyle,
  ColumnMenuStyle,
  GroupMenuStyle,
  MenuLabelStyle,
  SelectStyle,
  GroupLabelStyle,
  DividerStyle,
  IconBoxStyle,
  ExitContainerStyle,
  ExitIconStyle,
  MulticolGroupMenuStyle,
} from './styles';
import { SxProps } from '@mui/system';

export interface IGrpItm {
  groupId: string;
  itemId: string;
  itemName?: string;
}

interface IGrpItmIndex extends IGrpItm {
  groupIndex: number;
}

export interface IItem {
  name: string;
  group?: string;
  display_name_italian: string;
  display_name_english: string;
  description_italian: string;
  description_english: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface IGroup {
  groupId: string;
  groupName: string;
  groupIndex: number;
}

export type TSelectedValue = IGrpItm[];
export type TValueSet = { columns: { group: IGroup; items: IItem[] }[] }[];

export interface RowMenuProps {
  criteria?: (activeCombinations: any, current: any) => string[];
  needsSelection: Boolean;
  key: string;
  multicol?: number[];
  multicol_size?: number[];
  groupName: string;
  items: IItem[];
  disableable?: boolean;
}

export interface ColumnMenuProps {
  rows: RowMenuProps[];
}

// Groups in the value param have to be in the same order
// of the ones in valueSet.
export interface MultiRadioSelectProps {
  valueSet: ColumnMenuProps[];
  onChange?: (groupSelection: any, itemSelection: any) => void;
  sx?: SxProps<Theme>;
  menuSx?: SxProps<Theme>;
  mobileIcon?: JSX.Element;
  className?: string;
  label: string;
  current_map?: any;
  activeCombinations?: any;
  disabled?: boolean;
}

export function MultiRadioSelect(props: MultiRadioSelectProps) {
  const handleChange = props.onChange ? props.onChange : () => { };
  const valueSet = props.valueSet;
  const current_map = props.current_map;
  const sx = props.sx;
  const menuSx = props.menuSx;
  const label = props.label;
  const className = props.className ?? '';
  const MobileIcon = () => props.mobileIcon ?? <></>;
  const activeCombinations = props.activeCombinations ?? {};
  const disabled = props.disabled ?? false;

  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleChangeRadioGroup = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const k = event.target.value.split('|')[0];
    const v = event.target.value.split('|')[1];
    handleChange(k, v);
  };

  const [values, setValues] = React.useState<any[]>([]);

  React.useEffect(() => {
    let v: string[] = [];
    for (let vs of valueSet) {
      let ri = 0;
      for (let row of vs.rows) {
        ri++;
        let vv: string | undefined = '';
        if (row.key === 'reference_period') {
          let vk = row.key;
          if (current_map['aggregation_period'] === 'ten_year') {
            vk = 'decade';
          }
          vv = row.items.find(x => x.name === current_map[vk])?.name;
        } else {
          vv = row.items.find(x => x.name === current_map[row.key])?.name;
        }
        if (vv) {
          v.push(vv);
        }
      }
    }
    setValues(v);
  }, [valueSet]);

  const renderSelectedValue = (mode: string = 'label') => {
    let ret: any[] = [];
    for (let vs of valueSet) {
      let ri = 0;
      for (let row of vs.rows) {
        ri++;
        let vv: any = null;
        if (
          current_map['aggregation_period'] === 'annual' &&
          (row.key === 'reference_period' ||
            row.key === 'decade' ||
            row.key === 'time_window')
        ) {
          continue;
        }
        if (row.key === 'reference_period') {
          let vk = row.key;
          if (current_map['aggregation_period'] === 'ten_year') {
            vk = 'decade';
          }
          vv = row.items.find(x => x.name === current_map[vk]);
        } else {
          vv = row.items.find(x => x.name === current_map[row.key]);
        }
        if (vv) {
          ret.push(vv);
        }
      }
    }

    //ret = ret.filter(
    //  x =>
    //    ((x.name.indexOf('tw') >= 0 ||
    //      x.name.indexOf('climate_standard') >= 0 ||
    //      x.name.indexOf('ten') >= 0) &&
    //      (ret.filter(y => y.name === '30yr').length > 0 ||
    //        ret.filter(y => y.name === 'ten').length > 0)) ||
    //    (x.name.indexOf('tw') < 0 &&
    //      x.name.indexOf('climate_standard') < 0 &&
    //      x.name.indexOf('ten') < 0),
    //);
    //@ts-ignore
    ret = ret.map(x => translate(x, mode)).join(' - ');

    return ret;
  };

  const translate = (item: IItem, mode: string = 'label') => {
    if (!item) return '';

    const isItalian = i18n.language.startsWith('it');

    if (mode === 'label') {
      return isItalian ? item.display_name_italian : item.display_name_english;
    } else {
      return isItalian ? item.description_italian : item.description_english;
    }
  };

  const getFieldsByCriteria = (row, setting, current) => {
    if (JSON.stringify(setting) === JSON.stringify({})) {
      if (row.default) return row.default;
      return row.items.map(x => x.name);
    }
    const r = row.criteria(setting, current);
    if (r) {
      return r;
    }
    return row.items.map(x => x.name);
  };
  const getDisabledByCriteria = (row, current) => {
    try {
      const r = row.disabled(current);
      if (r) {
        return r;
      }
    } catch (ex) {
      return false;
    } finally {
      return false;
    }
  };

  return (
    <FormControl sx={sx} className={className} hiddenLabel={false}>
      {/*<FormControl sx={{...SelectContainerStyle,...sx}}>*/}
      <Select
        aria-label={label}
        aria-hidden={false}
        multiple
        disabled={disabled}
        value={values}
        renderValue={() =>
          isMobile ? (
            <Box sx={IconBoxStyle} aria-label={label}>
              <MobileIcon />
            </Box>
          ) : (
            renderSelectedValue('label')
          )
        }
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        sx={SelectStyle}
        className={`MultiRadioSelect ${isOpen ? 'MultiRadioSelect-open' : ''}`}
        MenuProps={{ sx: menuSx }}
      >
        <Box sx={ExitContainerStyle}>
          <IconButton
            sx={ExitIconStyle}
            color={'default'}
            component={'label'}
            onClick={() => setIsOpen(false)}
            aria-label={`chiudi ${label}`}
          >
            <ExitIcon fontSize={'medium'} />
          </IconButton>
        </Box>
        {/*@ts-ignore*/}
        <Box className={'MultiRadioSelectMenu'} sx={MultiRadioSelectMenuStyle}>
          {valueSet.map(({ rows }, cIndex) => (
            <Box
              className={'MultiRadioSelectMenuColumn'}
              sx={ColumnMenuStyle}
              key={cIndex}
            >
              {rows.map(row => (
                <div
                  key={row.key}
                  className={`${row.needsSelection ? 'NeedsSelection' : ''}`}
                >
                  {row.groupName && (
                    <>
                      <Typography
                        className={`MultiRadioSelectMenuGroupLabel`}
                        sx={GroupLabelStyle}
                      >
                        {row.groupName}
                      </Typography>
                      <Divider sx={DividerStyle} />
                    </>
                  )}
                  <RadioGroup
                    sx={(!isMobile && row.multicol) ? MulticolGroupMenuStyle : GroupMenuStyle}
                    aria-labelledby={`${row.key}-radio-group-label`}
                    onChange={event => {
                      handleChangeRadioGroup(event, row.key);
                    }}
                  >
                    {row.items.map((item, index) => {
                      return (
                        <MenuItem
                          key={item.name}
                          disableGutters
                          sx={{
                            marginBottom: (!isMobile && row.multicol?.includes(index + 1))
                              ? //@ts-ignore
                              row.multicol_size[
                                row.multicol?.indexOf(index + 1)
                              ].toString() + 'px'
                              : '0',
                          }}
                          disabled={
                            row.disableable &&
                            getFieldsByCriteria(
                              row,
                              activeCombinations,
                              current_map,
                            ).indexOf(item.name) < 0
                          }
                        >
                          <FormControlLabel
                            className={`MultiRadioSelectMenuItem ${item.selected
                                ? 'MultiRadioSelectMenuItem-selected'
                                : ''
                              }`}
                            //See Sorting fields note.
                            value={`${item.group}|${item.name}`}
                            control={<Radio />}
                            //@ts-ignore
                            checked={item.name === current_map[item.group]}
                            label={
                              <Box sx={MenuLabelStyle}>
                                <span aria-label={translate(item, 'label')}>
                                  {translate(item, 'label')}
                                </span>
                                {isMobile ? (
                                  <Typography variant={'caption'} sx={{
   "line-height": "1",
    "margin-top": "-8px"}}>
                                    {translate(item, 'description')}
                                  </Typography>
                                ) : (
                                  <Tooltip
                                    title={translate(item, 'description')}
                                    enterTouchDelay={0}
                                  >
                                    <InfoIcon fontSize={'small'} />
                                  </Tooltip>
                                )}
                              </Box>
                            }
                          />
                        </MenuItem>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
            </Box>
          ))}
        </Box>
      </Select>
    </FormControl>
  );
}

export default MultiRadioSelect;
