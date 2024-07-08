import { Box, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Collection from "./pages/Collection";
import Home from "./pages/Home";
import User from "./pages/User";
import { useState } from "react";

function App() {
  const [managementActor, setManagementActor] = useState(null);
  const [collectionActor, setCollectionActor] = useState(null);

  const saveActors = async (gameActor, charActor) => {
    setManagementActor(gameActor);
    setCollectionActor(charActor);
  };

  return (
    <Box className="">
      <Typography variant="h2" component="h2">
        ICP NFT Storage
      </Typography>

      <Routes>
        <Route path="/" element={<Home saveActors={saveActors} />} />
        <Route
          path="/:user"
          element={
            <User
              managementActor={managementActor}
              collectionActor={collectionActor}
            />
          }
        />
        <Route
          path="/:user/:collection"
          element={
            <Collection
              managementActor={managementActor}
              collectionActor={collectionActor}
            />
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
