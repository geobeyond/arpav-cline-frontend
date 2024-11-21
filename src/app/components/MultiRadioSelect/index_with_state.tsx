import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Container,
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
} from './styles';
import SnowIcon from '@mui/icons-material/AcUnit';
import { SxProps } from '@mui/system';

export interface IGrpItm {
  groupId: string;
  itemId: string;
  itemName: string;
}

interface IGrpItmIndex extends IGrpItm {
  groupIndex: number;
}

export interface IItem {
  id: string;
  name: string;
  description: string;
  disabled: boolean | null;
}

export interface IGroup {
  groupId: string;
  groupName: string;
  groupIndex: number;
}

export type TSelectedValue = IGrpItm[];
export type TValueSet = { column: { group: IGroup; items: IItem[] }[] }[];

// Groups in the value param have to be in the same order
// of the ones in valueSet.
export interface MultiRadioSelectProps {
  valueSet: TValueSet;
  value?: TSelectedValue;
  onChange?: (groupSelection: TSelectedValue, itemSelection: IGrpItm) => void;
  sx?: SxProps<Theme>;
  menuSx?: SxProps<Theme>;
}

export function MultiRadioSelect(props: MultiRadioSelectProps) {
  const handleChange = props.onChange ? props.onChange : () => { };
  const value = props.value ? props.value : [];
  const valueSet = props.valueSet;
  const sx = props.sx;
  const menuSx = props.menuSx;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const [selState, setSelState] = React.useState<IGrpItmIndex[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Assign the group index to the items.
    // Sorting fields note: the order of the fields is important to identify
    // the objets in the radio value.
    if (value.length > 0) {
      setSelState(
        value.map((item, index) => ({
          groupId: item.groupId,
          groupIndex: index,
          itemId: item.itemId,
          itemName: item.itemName,
        })),
      );
    } else {
      // selState cannot be empty because it controls the RadioGroup.
      // An error is thrown if the RadioGroup switches between
      // controlled and uncontrolled mode.
      setSelState(() => {
        const mergedGroups: IGrpItmIndex[] = [];
        valueSet.forEach(colCont => {
          const colGroups = colCont.column.map(groupCont => ({
            groupId: groupCont.group.groupId,
            groupIndex: groupCont.group.groupIndex,
            itemId: '',
            itemName: '',
          }));
          mergedGroups.push(...colGroups);
        });
        return mergedGroups;
      });
    }
  }, [props.value]);

  const handleChangeRadioGroup = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedValue: IGrpItmIndex = JSON.parse(event.target.value);
    // console.debug('handleChange_RadioGroup: ', event.target, selectedValue);
    const selStateTmp = [...selState];
    selStateTmp[selectedValue.groupIndex] = selectedValue;
    setSelState(selStateTmp);
    handleChange(selStateTmp, selectedValue);
  };

  const renderSelectedValue = (selectedValues: IGrpItmIndex[]) =>
    selectedValues
      .map(item => item.itemName)
      .filter(name => name)
      .join(' - ');

  return (
    <FormControl sx={sx}>
      <Select
        multiple
        value={selState}
        renderValue={selected =>
          isMobile ? (
            <Box sx={IconBoxStyle}>
              <SnowIcon />
            </Box>
          ) : (
            renderSelectedValue(selected)
          )
        }
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        sx={SelectStyle}
        className={`MultiRadioSelect ${isOpen ? 'MultiRadioSelect-open' : ''}`}
        MenuProps={{ sx: menuSx }}
      >
        {/*@ts-ignore*/}
        <Box className={'MultiRadioSelectMenu'} sx={MultiRadioSelectMenuStyle}>
          {valueSet.map((colCont, cIndex) => (
            <Box
              className={'MultiRadioSelectMenuColumn'}
              sx={ColumnMenuStyle}
              key={cIndex}
            >
              {colCont.column.map(groupCont => (
                <div key={groupCont.group.groupId}>
                  {groupCont.group.groupName && (
                    <>
                      <Typography
                        className={'MultiRadioSelectMenuGroupLabel'}
                        sx={GroupLabelStyle}
                      >
                        {groupCont.group.groupName}
                      </Typography>
                      <Divider sx={DividerStyle} />
                    </>
                  )}
                  <RadioGroup
                    sx={GroupMenuStyle}
                    aria-labelledby={`${groupCont.group.groupId}-radio-group-label`}
                    value={JSON.stringify(
                      selState[groupCont.group.groupIndex] as IGrpItmIndex,
                    )}
                    onChange={handleChangeRadioGroup}
                  >
                    {groupCont.items.map(item => {
                      const itemValue = JSON.stringify({
                        groupId: groupCont.group.groupId,
                        groupIndex: groupCont.group.groupIndex,
                        itemId: item.id,
                        itemName: item.name,
                      } as IGrpItmIndex);

                      const isSelected =
                        JSON.stringify(
                          selState[groupCont.group.groupIndex] as IGrpItmIndex,
                        ) === itemValue;

                      return (
                        <MenuItem key={item.id} disableGutters>
                          <FormControlLabel
                            className={`MultiRadioSelectMenuItem ${isSelected
                                ? 'MultiRadioSelectMenuItem-selected'
                                : ''
                              }`}
                            //See Sorting fields note.
                            value={itemValue}
                            control={<Radio />}
                            disabled={item.disabled === false}
                            label={
                              <Box sx={MenuLabelStyle}>
                                <span>{item.name}</span>
                                {isMobile ? (
                                  <Typography variant={'caption'}>
                                    {item.description}
                                  </Typography>
                                ) : (
                                  <Tooltip
                                    title={item.description}
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
