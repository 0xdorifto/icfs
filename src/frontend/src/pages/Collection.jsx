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
import { useEffect } from "react";
import UpdateMetadataDialog from "../components/UpdateMetadataDialog";
import { useParams } from "react-router-dom";

function createData(index, url) {
  return { index, url };
}

const rows = [
  createData(0, "url0"),
  createData(1, "url1"),
  createData(2, "url2"),
];

function Collection() {
  const { collection } = useParams();

  // useEffect(() => {
  //   async function checkUserExists() {
  //     if (managementActor) {
  //       try {
  //         setLoading(true);
  //         const exists = await managementActor.user_exists(user);
  //         console.log("exists", exists);
  //         if (exists) {
  //           setCollections(await managementActor.list_user_collections(user));
  //         } else {
  //           await managementActor.add_user(user);
  //           setCollections([]);
  //         }
  //         console.log("collections", collections);
  //       } catch (error) {
  //         console.error("Error checking user existence:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   }

  //   checkUserExists();
  // }, [managementActor, user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Collection {collection}
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
      <UpdateMetadataDialog />
    </Box>
  );
}

export default Collection;
