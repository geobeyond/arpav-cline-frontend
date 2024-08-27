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
  needsSelection: Boolean;
  key: string;
  groupName: string;
  items: IItem[];
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

  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleChangeRadioGroup = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    handleChange(key, event.target.value);
  };

  const values = valueSet
    .map(({ rows }) =>
      rows.map(
        ({ items }) =>
          items.find(x => x.name === current_map[rows[0].key])?.name,
      ),
    )
    .flat()
    .filter(x => x);
  const renderSelectedValue = () =>
    valueSet
      .map(({ rows }) =>
        rows.map(({ items }) =>
          items.find(x => x.name === current_map[rows[0].key]),
        ),
      )
      .flat()
      .filter(x => x)
      //@ts-ignore
      .map(x => translate(x, 'label'))
      .join(' - ');

  const translate = (item: IItem, mode: string = 'label') => {
    if (mode === 'label') {
      if (i18n.language === 'it') return item.display_name_italian;
      else return item.display_name_english;
    } else {
      if (i18n.language === 'it') return item.description_italian;
      else return item.description_english;
    }
  };

  return (
    <FormControl sx={sx} className={className} hiddenLabel={false}>
      {/*<FormControl sx={{...SelectContainerStyle,...sx}}>*/}
      <Select
        aria-label={label}
        aria-hidden={false}
        multiple
        value={values}
        renderValue={() =>
          isMobile ? (
            <Box sx={IconBoxStyle} aria-label={label}>
              <MobileIcon />
            </Box>
          ) : (
            renderSelectedValue()
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
                    sx={GroupMenuStyle}
                    aria-labelledby={`${row.key}-radio-group-label`}
                    onChange={event => {
                      handleChangeRadioGroup(event, row.key);
                    }}
                  >
                    {row.items.map(item => {
                      return (
                        <MenuItem
                          key={item.name}
                          disableGutters
                          disabled={item.disabled}
                        >
                          <FormControlLabel
                            className={`MultiRadioSelectMenuItem ${item.selected
                                ? 'MultiRadioSelectMenuItem-selected'
                                : ''
                              }`}
                            //See Sorting fields note.
                            value={item.name}
                            control={<Radio />}
                            // disabled={item.disabled}
                            checked={item.name === current_map[row.key]}
                            label={
                              <Box sx={MenuLabelStyle}>
                                <span aria-label={translate(item, 'label')}>
                                  {translate(item, 'label')}
                                </span>
                                {isMobile ? (
                                  <Typography variant={'caption'}>
                                    {translate(item, 'description')}
                                  </Typography>
                                ) : (
                                  <Tooltip
                                    title={translate(item, 'description')}
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
