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
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateCollectionDialog from "../components/CreateCollectionDialog";

function createData(name, collectionSize, chain, standard) {
  return { name, collectionSize, chain, standard };
}

const rows = [
  createData("Bored Apes", 10000, "Ethereum", "ERC-721"),
  createData("CryptoPunks", 100, "Ethereum", "ERC-721"),
  createData("Pudgy Penguins", 1000, "Base", "ERC-1155"),
];

function User({ managementActor }) {
  const { user } = useParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserExists() {
      if (managementActor) {
        try {
          setLoading(true);
          const exists = await managementActor.user_exists(user);
          console.log("exists", exists);
          if (exists) {
            console.log(await managementActor.list_user_collections(user));
            setCollections(await managementActor.list_user_collections(user));
          } else {
            await managementActor.add_user(user);
            setCollections([]);
          }
          console.log("collections", collections);
        } catch (error) {
          console.error("Error checking user existence:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    checkUserExists();
  }, [managementActor, user, collections]);

  const handleRowClick = () => {
    navigate(`/${user}/collection`);
  };

  const [openOverlay, setOpenOverlay] = useState(false);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Collections
      </Typography>

      {collections.length === 0 ? (
        <Typography>You don't have any collections...</Typography>
      ) : (
        <Typography>{console.log(collections)}</Typography>
      )}

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

      <Button
        variant="contained"
        className="m-4"
        onClick={() => setOpenOverlay(true)}
      >
        Create Collection
      </Button>

      <CreateCollectionDialog
        open={openOverlay}
        handleClose={() => setOpenOverlay(false)}
      />
    </Box>
  );
}

export default User;
