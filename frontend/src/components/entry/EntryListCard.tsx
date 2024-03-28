import { EntryBase } from "@dmm-com/airone-apiclient-typescript-fetch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardActionArea,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import { entryDetailsPath } from "Routes";
import { EntryControlMenu } from "components/entry/EntryControlMenu";

const StyledCard = styled(Card)(({}) => ({
  height: "100%",
}));

const StyledCardHeader = styled(CardHeader)(({}) => ({
  p: "0px",
  mt: "24px",
  mx: "16px",
  mb: "16px",
  ".MuiCardHeader-content": {
    width: "80%",
  },
}));

const EntryName = styled(Typography)(({}) => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

interface Props {
  entityId: number;
  entry: EntryBase;
  setToggle?: () => void;
}

export const EntryListCard: FC<Props> = ({ entityId, entry, setToggle }) => {
  const [anchorElem, setAnchorElem] = useState<HTMLButtonElement | null>(null);

  return (
    <StyledCard>
      <StyledCardHeader
        title={
          <CardActionArea
            component={Link}
            to={entryDetailsPath(entityId, entry.id)}
          >
            <EntryName variant="h6" title={entry.name}>{entry.name}</EntryName>
          </CardActionArea>
        }
        action={
          <>
            <IconButton onClick={(e) => setAnchorElem(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <EntryControlMenu
              entityId={entityId}
              entryId={entry.id}
              anchorElem={anchorElem}
              handleClose={() => setAnchorElem(null)}
              setToggle={setToggle}
            />
          </>
        }
      />
    </StyledCard>
  );
};
