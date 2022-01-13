import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { topPath } from "../Routes";
import { ACLForm } from "../components/common/ACLForm";
import { AironeBreadcrumbs } from "../components/common/AironeBreadcrumbs";
import { Loading } from "../components/common/Loading";
import { getACL } from "../utils/AironeAPIClient";

export const ACL: FC = () => {
  const { entityId } = useParams<{ entityId: number }>();

  const acl: any = useAsync(async () => {
    const resp = await getACL(entityId);
    return await resp.json();
  });

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography color="textPrimary">ACL</Typography>
      </AironeBreadcrumbs>

      {acl.loading ? (
        <Loading />
      ) : (
        <>
          <Typography>{acl.value.name} の ACL 設定</Typography>
          <ACLForm objectId={entityId} acl={acl.value} />
        </>
      )}
    </Box>
  );
};
