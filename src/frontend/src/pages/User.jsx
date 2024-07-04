import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
import CreateCollectionDialog from "../components/CreateCollectionDialog";

function createData(name, collectionSize, chain, standard) {
  return { name, collectionSize, chain, standard };
}

const rows = [
  createData("Bored Apes", 10000, "Ethereum", "ERC-721"),
  createData("CryptoPunks", 100, "Ethereum", "ERC-721"),
  createData("Pudgy Penguins", 1000, "Base", "ERC-1155"),
];

function User() {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/user/collection`);
  };

  const [openOverlay, setOpenOverlay] = useState(false);

  const handleButtonClick = () => {
    setOpenOverlay(true);
  };

  const handleCloseOverlay = () => {
    setOpenOverlay(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Collections
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Collection Size</TableCell>
              <TableCell align="right">Chain</TableCell>
              <TableCell align="right">Standard</TableCell>
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
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.collectionSize}</TableCell>
                <TableCell align="right">{row.chain}</TableCell>
                <TableCell align="right">{row.standard}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" className="mt-4" onClick={handleButtonClick}>
        Create Collection
      </Button>

      <CreateCollectionDialog
        open={openOverlay}
        handleClose={handleCloseOverlay}
      />
    </Box>
  );
}

export default User;
