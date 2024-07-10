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
import { useEffect, useState } from "react";
import CreateMetadataDialog from "../components/CreateMetadataDialog";
import UpdateMetadataDialog from "../components/UpdateMetadataDialog";

function Collection({ collectionActor, collectionPrincipal }) {
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    async function checkCollectionExists() {
      if (collectionActor) {
        try {
          console.log("collectionActor", collectionActor);
          setLoading(true);
          setSize(await collectionActor.get_collection_size());
          setCollection(await collectionActor.get_all_collection_info());
          console.log("collection", collection);
        } catch (error) {
          console.error("Error checking user existence:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    checkCollectionExists();
  }, [collectionActor]);

  const handleClick = (index) => {
    window.open(
      `https://${collectionPrincipal}.raw.icp0.io/${index}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Fetching Collection...
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* {collection.name && (
        <Typography variant="h4" gutterBottom>
          Collection {collection.name}
        </Typography>
      )} */}

      {/* <Typography>Description {collection.description}</Typography> */}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleClick(index)}
              >
                <TableCell component="th" scope="row">
                  {index}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UpdateMetadataDialog collectionActor={collectionActor} />
      <CreateMetadataDialog collectionActor={collectionActor} />
    </Box>
  );
}

export default Collection;
