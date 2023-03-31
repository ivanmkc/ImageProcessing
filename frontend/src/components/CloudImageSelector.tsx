import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getImageInfo, CloudImageInfo } from "queries";
import { useState } from "react";
import { useQuery } from "react-query";

import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
interface Column {
  id: "imageId" | "annotation";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "imageId", label: "Select an image below" },
];

const StickyHeadTable = ({
  selectedValue,
  listInfos,
  isLoading,
  onInfoSelected,
}: {
  selectedValue?: CloudImageInfo;
  listInfos: CloudImageInfo[];
  isLoading: Boolean;
  onInfoSelected: (info: CloudImageInfo) => void;
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <Alert
        severity="info"
        icon={<CircularProgress size={24} />}
        sx={{ height: 40 }}
      >
        <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
          Loading images from Cloud Storage
        </Typography>
      </Alert>
    );
  } else {
    return (
      <Paper sx={{ overflow: "auto", flex: 1 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listInfos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((info) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={info.annotation}
                      selected={selectedValue?.annotation == info.annotation}
                      onClick={(event) => onInfoSelected(info)}
                    >
                      {columns.map((column) => {
                        const value = info[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={listInfos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
};

export default ({
  onImageInfoSelected,
}: {
  onImageInfoSelected: (info: CloudImageInfo) => void;
}) => {
  const [selectedImageInfo, setSelectedImageInfo] = useState<CloudImageInfo>();
  const getImageInfoQuery = useQuery<CloudImageInfo[], Error>(
    ["getImageInfo"],
    () => {
      return getImageInfo().then((infos) =>
        infos.filter((info) => info.annotation != null)
      );
    },
    { staleTime: Infinity }
  );

  return (
    <StickyHeadTable
      selectedValue={selectedImageInfo}
      listInfos={getImageInfoQuery.data ?? []}
      isLoading={getImageInfoQuery.isLoading}
      onInfoSelected={(info) => {
        setSelectedImageInfo(info);
        onImageInfoSelected(info);
      }}
    />
  );
};
