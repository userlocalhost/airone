import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupIcon from "@mui/icons-material/Group";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Input,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import React, { FC, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Entity } from "../../apiclient/autogenerated";

import { aclPath, entitiesPath } from "Routes";
import { createEntity, updateEntity } from "utils/AironeAPIClient";

const BaseAttributeTypes = {
  object: 1 << 0,
  string: 1 << 1,
  text: 1 << 2,
  bool: 1 << 3,
  group: 1 << 4,
  date: 1 << 5,
  array: 1 << 10,
  named: 1 << 11,
};

export const AttributeTypes = {
  object: {
    name: "entry",
    type: BaseAttributeTypes.object,
  },
  string: {
    name: "string",
    type: BaseAttributeTypes.string,
  },
  named_object: {
    name: "named_entry",
    type: BaseAttributeTypes.object | BaseAttributeTypes.named,
  },
  array_object: {
    name: "array_entry",
    type: BaseAttributeTypes.object | BaseAttributeTypes.array,
  },
  array_string: {
    name: "array_string",
    type: BaseAttributeTypes.string | BaseAttributeTypes.array,
  },
  array_named_object: {
    name: "array_named_entry",
    type:
      BaseAttributeTypes.object |
      BaseAttributeTypes.named |
      BaseAttributeTypes.array,
  },
  array_group: {
    name: "array_group",
    type: BaseAttributeTypes.group | BaseAttributeTypes.array,
  },
  text: {
    name: "textarea",
    type: BaseAttributeTypes.text,
  },
  boolean: {
    name: "boolean",
    type: BaseAttributeTypes.bool,
  },
  group: {
    name: "group",
    type: BaseAttributeTypes.group,
  },
  date: {
    name: "date",
    type: BaseAttributeTypes.date,
  },
};

const useStyles = makeStyles<Theme>((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#607D8B0A",
  },
}));

interface Props {
  entity?: Entity;
  referralEntities: Entity[];
}

export const EntityForm: FC<Props> = ({ entity, referralEntities }) => {
  const classes = useStyles();
  const history = useHistory();

  const createMode = entity?.id === undefined;
  const [name, setName] = useState(entity?.name ?? "");
  const [note, setNote] = useState(entity?.note ?? "");
  const [isTopLevel, setIsTopLevel] = useState(entity?.isToplevel ?? false);
  const [attributes, setAttributes] = useState<{ [key: string]: any }[]>(
    entity?.attrs.map((attr) => {
      return { ...attr, refIds: attr.referrals.map((r) => r.id) };
    }) ?? []
  );
  const [referralFilters, setReferralFilters] = useState<{
    [attrId: number]: string;
  }>({});

  const handleChangeAttributeValue = (
    index: number,
    key: string,
    value: any
  ) => {
    attributes[index][key] = value;
    setAttributes([...attributes]);
  };

  const handleAppendAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: "",
        type: AttributeTypes.string.type,
        is_mandatory: false,
        is_delete_in_chain: false,
        refIds: [],
      },
    ]);
  };

  const handleDeleteAttribute = (index: number) => {
    attributes[index] = {
      ...attributes[index],
      deleted: true,
    };
    setAttributes([...attributes]);
  };

  const handleSubmit = async () => {
    // Adjusted attributes for the API
    const attrs = attributes
      .filter((attr) => attr.id != null)
      .map((attr, index) => {
        return {
          id: attr.id,
          name: attr.name,
          type: String(attr.type),
          row_index: String(index),
          is_mandatory: attr.is_mandatory,
          is_delete_in_chain: attr.is_delete_in_chain,
          ref_ids: attr.refIds,
          deleted: attr.deleted,
        };
      });

    if (createMode) {
      await createEntity(name, note, isTopLevel, attrs);
      history.replace(entitiesPath());
    } else {
      await updateEntity(entity.id, name, note, isTopLevel, attrs);
      history.replace(entitiesPath());
    }
  };

  const handleCancel = () => {
    history.replace(entitiesPath());
  };

  const attributeTypeMenuItems = useMemo(() => {
    return Object.keys(AttributeTypes).map((typename, index) => (
      <MenuItem key={index} value={AttributeTypes[typename].type}>
        {AttributeTypes[typename].name}
      </MenuItem>
    ));
  }, []);

  return (
    <Box>
      <Box>
        <Box>
          <Box my="64px">
            <Typography variant="h2" align="center">
              {createMode ? "新規エンティティの作成" : `${entity.name}の編集`}
            </Typography>
          </Box>

          <Box my="32px">
            <Typography variant="h4" align="center">
              基本情報
            </Typography>
          </Box>

          <Table className="table table-bordered">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#455A64" }}>
                <TableCell sx={{ color: "#FFFFFF" }}>項目</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>内容</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>エンティティ名</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={name}
                    placeholder="エンティティ名"
                    sx={{ width: "100%" }}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>備考</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={note}
                    placeholder="備考"
                    sx={{ width: "100%" }}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>サイドバーに表示</TableCell>
                <TableCell>
                  <Checkbox
                    checked={isTopLevel}
                    onChange={(e) => setIsTopLevel(e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box my="32px">
            <Typography variant="h4" align="center">
              属性情報
            </Typography>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#455A64" }}>
                <TableCell sx={{ color: "#FFFFFF" }}>属性名</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>型</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>必須</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>関連削除</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>属性の削除</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes
                .filter((attr) => attr.deleted !== true)
                .map((attr, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>
                      <Input
                        type="text"
                        value={attr.name}
                        placeholder="属性名"
                        sx={{ width: "100%" }}
                        onChange={(e) =>
                          handleChangeAttributeValue(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Box minWidth={100} marginX={1}>
                          <Select
                            fullWidth={true}
                            value={attr.type}
                            disabled={attr.id != null}
                            onChange={(e) =>
                              handleChangeAttributeValue(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                          >
                            {attributeTypeMenuItems}
                          </Select>
                        </Box>
                        {(attr.type & BaseAttributeTypes.object) > 0 && (
                          <Box minWidth={100} marginX={1}>
                            <Typography>エンティティを選択</Typography>
                            <Select
                              multiple
                              value={attr.refIds}
                              renderValue={(selectedIds: number[]) => (
                                <>
                                  {referralEntities
                                    .filter((r) => selectedIds.includes(r.id))
                                    .map((r) => (
                                      <Chip
                                        key={r.id}
                                        label={r.name}
                                        onDelete={() => {
                                          handleChangeAttributeValue(
                                            index,
                                            "refIds",
                                            attr.refIds.filter(
                                              (id) => id !== r.id
                                            )
                                          );
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      />
                                    ))}
                                </>
                              )}
                              onChange={(e) => {
                                handleChangeAttributeValue(
                                  index,
                                  "refIds",
                                  e.target.value
                                );
                              }}
                              MenuProps={{ style: { maxHeight: 500 } }}
                            >
                              <Box mx={2} my={1}>
                                <Input
                                  type="text"
                                  placeholder="絞り込み"
                                  value={referralFilters[attr.id] ?? ""}
                                  onChange={(e) =>
                                    setReferralFilters({
                                      ...referralFilters,
                                      [attr.id]: e.target.value,
                                    })
                                  }
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </Box>
                              {referralEntities
                                .filter((e) => !attr.refIds.includes(e.id))
                                .filter((e) => {
                                  const keyword =
                                    referralFilters[attr.id] ?? "";
                                  return keyword.length > 0
                                    ? e.name.indexOf(keyword) !== -1
                                    : true;
                                })
                                .map((e) => (
                                  <MenuItem key={e.id} value={e.id}>
                                    {e.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </Box>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={attr.is_mandatory}
                        onChange={(e) =>
                          handleChangeAttributeValue(
                            index,
                            "is_mandatory",
                            e.target.checked
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={attr.is_delete_in_chain}
                        onChange={(e) =>
                          handleChangeAttributeValue(
                            index,
                            "is_delete_in_chain",
                            e.target.checked
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        className={classes.button}
                        onClick={(e) => handleDeleteAttribute(index)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      {attr.id != null && (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<GroupIcon />}
                          component={Link}
                          to={aclPath(attr.id)}
                        >
                          ACL
                        </Button>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box my="32px">
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={handleAppendAttribute}
        >
          属性追加
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" my="32px">
        <Box mx="16px">
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            保存
          </Button>
        </Box>
        <Box mx="16px">
          <Button variant="outlined" color="primary" onClick={handleCancel}>
            キャンセル
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
