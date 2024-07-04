import { Box, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Collection from "./pages/Collection";
import Home from "./pages/Home";
import User from "./pages/User";

function App() {
  return (
    <Box className="">
      <Typography variant="h2" component="h2">
        ICP NFT Storage
      </Typography>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/collection" element={<Collection />} />
      </Routes>
    </Box>
  );
}

export default App;
