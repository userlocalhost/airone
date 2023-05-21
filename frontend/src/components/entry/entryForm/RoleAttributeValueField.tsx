import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form/dist/types/form";
import { useAsync } from "react-use";

import { aironeApiClientV2 } from "../../../repository/AironeApiClientV2";

import { Schema } from "./EntryFormSchema";

interface Props {
  attrId: number;
  control: Control<Schema>;
  setValue: UseFormSetValue<Schema>;
  multiple?: boolean;
}

export const RoleAttributeValueField: FC<Props> = ({
  multiple,
  attrId,
  control,
  setValue,
}) => {
  const roles = useAsync(async () => {
    const _roles = await aironeApiClientV2.getRoles();
    return _roles.map((g) => ({ id: g.id, name: g.name }));
  }, []);

  const handleChange = (
    value: { id: number; name: string } | { id: number; name: string }[] | null
  ) => {
    if (multiple === true) {
      if (value != null && !Array.isArray(value)) {
        throw new Error("value must be an array");
      }
      setValue(`attrs.${attrId}.value.asArrayRole`, value ?? [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      if (value != null && Array.isArray(value)) {
        throw new Error("value must not be an array");
      }
      setValue(`attrs.${attrId}.value.asRole`, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <Box>
      <Typography variant="caption" color="rgba(0, 0, 0, 0.6)">
        ロールを選択
      </Typography>
      <Box display="flex" alignItems="center">
        <Controller
          name={
            multiple === true
              ? `attrs.${attrId}.value.asArrayRole`
              : `attrs.${attrId}.value.asRole`
          }
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              sx={{ width: "280px" }}
              multiple={multiple}
              loading={roles.loading}
              options={roles.value ?? []}
              value={field.value}
              getOptionLabel={(option: { id: number; name: string }) =>
                option.name
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_e, value) => handleChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={error != null}
                  helperText={error?.message}
                  size="small"
                  placeholder={multiple ? "" : "-NOT SET-"}
                />
              )}
            />
          )}
        />
      </Box>
    </Box>
  );
};
