import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import UpdateMetadataDialog from "../components/UpdateMetadataDialog";

function createData(index, url) {
  return { index, url };
}

const rows = [
  createData(0, "url0"),
  createData(1, "url1"),
  createData(2, "url2"),
];

function Collection() {
  const [openOverlay, setOpenOverlay] = useState(false);

  const handleRowClick = () => {
    setOpenOverlay(true);
  };

  const handleCloseOverlay = () => {
    setOpenOverlay(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Collection XYZ
      </Typography>

      <Typography>Description bla bla bla</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell align="right">URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleRowClick()}
              >
                <TableCell component="th" scope="row">
                  {row.index}
                </TableCell>
                <TableCell align="right">{row.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UpdateMetadataDialog
        open={openOverlay}
        handleClose={handleCloseOverlay}
      />
    </Box>
  );
}

export default Collection;
