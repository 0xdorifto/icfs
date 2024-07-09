import { Typography, Box } from "@mui/material";

function Navbar({ accountId }) {
  return (
    <header className="flex justify-between border-b mb-4">
      <Typography variant="h2" gutterBottom>
        ICP NFT Storage
      </Typography>
      {accountId && <Box>Account ID: {accountId}</Box>}
    </header>
  );
}

export default Navbar;
