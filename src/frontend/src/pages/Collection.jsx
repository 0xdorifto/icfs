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
import UpdateMetadataDialog from "../components/UpdateMetadataDialog";

function createData(index, url) {
  return { index, url };
}

const rows = [
  createData(0, "url0"),
  createData(1, "url1"),
  createData(2, "url2"),
];

function Collection({ collectionActor }) {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    async function checkCollectionExists() {
      if (collectionActor) {
        try {
          console.log("collectionActor", collectionActor);
          setLoading(true);
          setCollection(await collectionActor.get_all_collection_info());
          setTokens(await collectionActor.get_all_metadata());
          console.log("collection", collection);
          console.log("tokens", tokens);
        } catch (error) {
          console.error("Error checking user existence:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    checkCollectionExists();
  }, [collectionActor]);

  const handleClick = () => {
    window.open(
      "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1166",
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

      {setTokens.length === 0 && (
        <Typography>
          You don't have any tokens... Click the button to create one!
        </Typography>
      )}

      {/* <Typography>Description {collection.description}</Typography> */}

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
                onClick={() => handleClick()}
              >
                <TableCell component="th" scope="row">
                  {row.index}
                </TableCell>
                <TableCell align="right">{row.url}</TableCell>
              </TableRow>
            ))}
            {tokens.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleClick()}
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
      <UpdateMetadataDialog collectionActor={collectionActor} />
    </Box>
  );
}

export default Collection;
