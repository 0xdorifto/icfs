import { Box } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import Collection from "./pages/Collection";
import Home from "./pages/Home";
import User from "./pages/User";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [accountId, setAccountId] = useState("");
  const [managementActor, setManagementActor] = useState(null);
  // const [collectionActor, setCollectionActor] = useState(null);

  const navigate = useNavigate();

  const saveActors = async (gameActor) => {
    setManagementActor(gameActor);
    // setCollectionActor(collectionActor);
  };

  useEffect(() => {
    console.log;
    navigate(`/${accountId}`);
  }, [accountId]);

  return (
    <Box className="p-4">
      <Navbar accountId={accountId} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                saveActors={saveActors}
                accountId={accountId}
                setAccountId={setAccountId}
              />
            }
          />
          <Route
            path="/:user"
            element={
              <User
                managementActor={managementActor}
                // collectionActor={collectionActor}
              />
            }
          />
          <Route
            path="/:user/:collection"
            element={
              <Collection
                managementActor={managementActor}
                // collectionActor={collectionActor}
              />
            }
          />
        </Routes>
      </main>
    </Box>
  );
}

export default App;
