import {
  Box,
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

function createData(name, collection_size, chain_name, standard) {
  return { name, collection_size, chain_name, standard };
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
  }, [managementActor, user]);

  const handleRowClick = (name) => {
    navigate(`/${user}/${name}`);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Your Collections
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Collections
      </Typography>

      {collections.length === 0 && (
        <Typography>
          You don't have any collections... If you did, it would look like this:
        </Typography>
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
            {collections.length === 0
              ? rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.collection_size}</TableCell>
                    <TableCell align="right">{row.chain_name}</TableCell>
                    <TableCell align="right">{row.standard}</TableCell>
                  </TableRow>
                ))
              : collections[0].map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleRowClick(row.name)}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.collection_size}</TableCell>
                    <TableCell align="right">{row.chain_name}</TableCell>
                    <TableCell align="right">{row.standard}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateCollectionDialog managementActor={managementActor} user={user} />
    </Box>
  );
}

export default User;
