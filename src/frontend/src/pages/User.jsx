import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateCollectionDialog from "../components/CreateCollectionDialog";

function User({ managementActor }) {
  const { user } = useParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    if (managementActor) {
      try {
        setLoading(true);
        const exists = await managementActor.user_exists(user);
        if (exists) {
          const userCollections = await managementActor.list_user_collections(
            user
          );
          setCollections(userCollections);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [managementActor, user]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleRowClick = (name) => {
    navigate(`/${user}/${name}`);
  };

  const handleCollectionCreated = () => {
    fetchCollections();
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
          You don't have any collections... Click the button to create one!
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
            {collections.length !== 0 &&
              collections[0].map((row) => (
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

      <CreateCollectionDialog
        managementActor={managementActor}
        user={user}
        collections={collections}
        onCollectionCreated={handleCollectionCreated}
      />
    </Box>
  );
}

export default User;
