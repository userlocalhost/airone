import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { entitiesPath, topPath } from "../Routes";
import { AironeBreadcrumbs } from "../components/common/AironeBreadcrumbs";
import { Loading } from "../components/common/Loading";
import { getEntityHistory } from "../utils/AironeAPIClient";

const Operations = {
  ADD: 1 << 0,
  MOD: 1 << 1,
  DEL: 1 << 2,
};

const Targets = {
  ENTITY: 1 << 3,
  ATTR: 1 << 4,
  ENTRY: 1 << 5,
};

const TargetOperation = {
  ADD_ENTITY: Operations.ADD + Targets.ENTITY,
  ADD_ATTR: Operations.ADD + Targets.ATTR,
  MOD_ENTITY: Operations.MOD + Targets.ENTITY,
  MOD_ATTR: Operations.MOD + Targets.ATTR,
  DEL_ENTITY: Operations.DEL + Targets.ENTITY,
  DEL_ATTR: Operations.DEL + Targets.ATTR,
  DEL_ENTRY: Operations.DEL + Targets.ENTRY,
};

export const EntityHistory: FC = () => {
  const { entityId } = useParams<{ entityId: number }>();

  const history = useAsync(async () => {
    const resp = await getEntityHistory(entityId);
    return await resp.json();
  });

  return (
    <Box className="container">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={entitiesPath()}>
          エンティティ一覧
        </Typography>
        <Typography color="textPrimary">変更履歴</Typography>
      </AironeBreadcrumbs>

      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell>Operator</TableCell>
            <TableCell>Operation</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.loading ? (
            <Loading />
          ) : (
            <>
              {history.value.map((column, index) => (
                <TableRow key={index}>
                  <TableCell>{column.user.username}</TableCell>
                  <TableCell>
                    {(() => {
                      switch (column.operation) {
                        case TargetOperation.ADD_ENTITY:
                          return <Typography>作成</Typography>;
                        case TargetOperation.MOD_ENTITY:
                          return <Typography>変更</Typography>;
                        case TargetOperation.DEL_ENTITY:
                          return <Typography>削除</Typography>;
                        default:
                          return (
                            <Typography>
                              {column.operation} ({TargetOperation.ADD_ENTITY})
                            </Typography>
                          );
                      }
                    })()}
                  </TableCell>
                  <TableCell>
                    <Table>
                      <TableBody>
                        {column.details.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {(() => {
                                switch (detail.operation) {
                                  case TargetOperation.MOD_ENTITY:
                                    return <Typography>変更</Typography>;
                                  case TargetOperation.ADD_ATTR:
                                    return <Typography>属性追加</Typography>;
                                  case TargetOperation.MOD_ATTR:
                                    return <Typography>属性変更</Typography>;
                                  case TargetOperation.DEL_ATTR:
                                    return <Typography>属性削除</Typography>;
                                  default:
                                    return <Typography />;
                                }
                              })()}
                            </TableCell>
                            <TableCell>{detail.target_obj.name}</TableCell>
                            <TableCell>{detail.text}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell>{column.time}</TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
