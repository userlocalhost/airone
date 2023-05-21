import {
  Box,
  Button,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";

import { entityEntriesPath } from "../../Routes";
import { JobSerializers } from "../../apiclient/autogenerated";
import { aironeApiClientV2 } from "../../repository/AironeApiClientV2";
import { JobOperations, JobStatuses } from "../../services/Constants";
import { formatDate } from "../../services/DateUtil";
import { jobOperationLabel } from "../../services/JobUtil";
import { Confirmable } from "../common/Confirmable";

const StyledTableRow = styled(TableRow)(({}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#607D8B0A",
  },
}));

interface Props {
  jobs: JobSerializers[];
}

export const JobList: FC<Props> = ({ jobs }) => {
  const history = useHistory();

  const handleRerun = async (jobId: number) => {
    await aironeApiClientV2.rerunJob(jobId);
    history.go(0);
  };

  const handleCancel = async (jobId: number) => {
    await aironeApiClientV2.cancelJob(jobId);
    history.go(0);
  };

  return (
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#455A64" }}>
          <TableCell sx={{ color: "#FFFFFF" }}>対象エンティティ</TableCell>
          <TableCell sx={{ color: "#FFFFFF" }}>状況</TableCell>
          <TableCell sx={{ color: "#FFFFFF" }}>操作</TableCell>
          <TableCell sx={{ color: "#FFFFFF" }}>実行時間</TableCell>
          <TableCell sx={{ color: "#FFFFFF" }}>実行日時</TableCell>
          <TableCell sx={{ color: "#FFFFFF" }}>備考</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <StyledTableRow key={job.id}>
            <TableCell>
              {(() => {
                switch (job.operation) {
                  case JobOperations.CREATE_ENTITY:
                  case JobOperations.EDIT_ENTITY:
                  case JobOperations.DELETE_ENTITY:
                  case JobOperations.IMPORT_ENTRY:
                  case JobOperations.EXPORT_ENTRY:
                  case JobOperations.IMPORT_ENTRY_V2:
                  case JobOperations.EXPORT_ENTRY_V2:
                    return (
                      <Typography
                        component={Link}
                        to={entityEntriesPath(job.target?.id ?? 0)}
                      >
                        {job.target?.name ?? ""}
                      </Typography>
                    );
                  case JobOperations.CREATE_ENTRY:
                  case JobOperations.EDIT_ENTRY:
                  case JobOperations.DELETE_ENTRY:
                  case JobOperations.COPY_ENTRY:
                  case JobOperations.RESTORE_ENTRY:
                  case JobOperations.NOTIFY_CREATE_ENTRY:
                  case JobOperations.NOTIFY_UPDATE_ENTRY:
                  case JobOperations.NOTIFY_DELETE_ENTRY:
                  case JobOperations.DO_COPY_ENTRY:
                    return (
                      <Typography
                        component={Link}
                        to={entityEntriesPath(job.target?.schemaId ?? 0)}
                      >
                        {job.target?.schemaName ?? ""}
                      </Typography>
                    );
                  default:
                    return <Typography />;
                }
              })()}
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center">
                <Box display="flex" alignItems="center">
                  {(() => {
                    switch (job.status) {
                      case JobStatuses.PREPARING:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>処理前</Typography>
                          </>
                        );
                      case JobStatuses.DONE:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "#607D8B",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>完了</Typography>
                          </>
                        );
                      case JobStatuses.ERROR:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "#B00020",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>失敗</Typography>
                          </>
                        );
                      case JobStatuses.TIMEOUT:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "#B00020",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>タイムアウト</Typography>
                          </>
                        );
                      case JobStatuses.PROCESSING:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "#90CAF9",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>処理中</Typography>
                          </>
                        );
                      case JobStatuses.CANCELED:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "#607D8B",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>キャンセル</Typography>
                          </>
                        );
                      default:
                        return (
                          <>
                            <Box
                              width="16px"
                              height="16px"
                              mx="4px"
                              sx={{
                                backgroundColor: "black",
                                borderRadius: "8px",
                              }}
                            />
                            <Typography>不明</Typography>
                          </>
                        );
                    }
                  })()}
                </Box>
                <Box flexGrow="1" mx="16px">
                  {![
                    JobStatuses.DONE,
                    JobStatuses.PROCESSING,
                    JobStatuses.CANCELED,
                  ].includes(job.status ?? 0) && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ my: "4px" }}
                      onClick={() => handleRerun(job.id)}
                    >
                      再実行
                    </Button>
                  )}
                  {![
                    JobStatuses.DONE,
                    JobStatuses.ERROR,
                    JobStatuses.CANCELED,
                  ].includes(job.status ?? 0) && (
                    <Confirmable
                      componentGenerator={(handleOpen) => (
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ my: "4px" }}
                          onClick={handleOpen}
                        >
                          キャンセル
                        </Button>
                      )}
                      dialogTitle="本当にキャンセルしますか？"
                      onClickYes={() => handleCancel(job.id)}
                    />
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Typography>{jobOperationLabel(job.operation)}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{job.passedTime} s</Typography>
            </TableCell>
            <TableCell>
              <Typography>{formatDate(job.createdAt)}</Typography>
            </TableCell>
            <TableCell>
              {(job.operation == JobOperations.EXPORT_ENTRY ||
                job.operation == JobOperations.EXPORT_SEARCH_RESULT ||
                job.operation == JobOperations.EXPORT_ENTRY_V2) &&
              job.status == JobStatuses.DONE ? (
                <MuiLink href={`/job/download/${job.id}`}>Download</MuiLink>
              ) : (
                <Typography>{job.text}</Typography>
              )}
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
};
