import AppsIcon from "@mui/icons-material/Apps";
import {
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FC, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAsync } from "react-use";

import {
  aclPath,
  entitiesPath,
  entityPath,
  importEntriesPath,
  topPath,
} from "Routes";
import { aironeApiClientV2 } from "apiclient/AironeApiClientV2";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { EntryList as Entry } from "components/entry/EntryList";
import { getEntries, exportEntries } from "utils/AironeAPIClient";

const useStyles = makeStyles<Theme>((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  entryName: {
    margin: theme.spacing(1),
  },
}));

interface EntityControlProps {
  entityId: number;
  anchorElem: HTMLButtonElement | null;
  handleClose: () => void;
}

// TODO consider to separate a composite component handling anchor and menu events
const EntityControlMenu: FC<EntityControlProps> = ({
  entityId,
  anchorElem,
  handleClose,
}) => {
  return (
    <Menu
      id={`entityControlMenu-${entityId}`}
      open={Boolean(anchorElem)}
      onClose={() => handleClose()}
      anchorEl={anchorElem}
    >
      <MenuItem component={Link} to={entityPath(entityId)}>
        <Typography>編集</Typography>
      </MenuItem>
      <MenuItem component={Link} to={aclPath(entityId)}>
        <Typography>ACL</Typography>
      </MenuItem>
      {/* FIXME have a message after triggering an event */}
      <MenuItem
        onClick={async () => {
          await exportEntries(entityId, "YAML");
        }}
      >
        <Typography>エクスポート(YAML)</Typography>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          await exportEntries(entityId, "CSV");
        }}
      >
        <Typography>エクスポート(CSV)</Typography>
      </MenuItem>
      {/* FIXME something wrong on the next page??? */}
      <MenuItem component={Link} to={importEntriesPath(entityId)}>
        <Typography>インポート</Typography>
      </MenuItem>
    </Menu>
  );
};

interface EntryListProps {
  canCreateEntry?: boolean;
}

export const EntryListPage: FC<EntryListProps> = ({
  canCreateEntry = true,
}) => {
  const classes = useStyles();
  const { entityId } = useParams<{ entityId: number }>();

  const [entityAnchorEl, setEntityAnchorEl] =
    useState<HTMLButtonElement | null>();

  const entity = useAsync(async () => {
    return await aironeApiClientV2.getEntity(entityId);
  });

  const entries = useAsync(async () => {
    const resp = await getEntries(entityId, true);
    return await resp.json();
  });

  return (
    <Box>
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={entitiesPath()}>
          エンティティ一覧
        </Typography>
        <Typography color="textPrimary">
          {entity.loading ? "" : entity.value.name}
        </Typography>
      </AironeBreadcrumbs>

      <Container maxWidth="lg" sx={{ marginTop: "111px" }}>
        {/* NOTE: This Box component that has CSS tuning should be custom component */}
        <Box
          display="flex"
          sx={{ borderBottom: 1, borderColor: "gray", mb: "64px", pb: "64px" }}
        >
          <Box width="50px" />
          <Box flexGrow="1">
            {!entity.loading && (
              <Typography variant="h2" align="center">
                {entity.value.name}
              </Typography>
            )}
            <Typography variant="h4" align="center">
              エントリ一覧
            </Typography>
          </Box>
          <Box width="50px">
            <IconButton
              onClick={(e) => {
                setEntityAnchorEl(e.currentTarget);
              }}
            >
              <AppsIcon />
            </IconButton>
            <EntityControlMenu
              entityId={entityId}
              anchorElem={entityAnchorEl}
              handleClose={() => setEntityAnchorEl(null)}
            />
          </Box>
        </Box>

        {entries.loading ? (
          <Loading />
        ) : (
          <Entry
            entityId={entityId}
            entries={entries.value}
            restoreMode={false}
            canCreateEntry={canCreateEntry}
          />
        )}
      </Container>
    </Box>
  );
};
