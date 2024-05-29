import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserInput from "./component/UserInput";
import NFTDisplay from "./component/NFTDisplay";

const App: React.FC = () => {
  const [nftObject, setNftObject] = useState<string>("");

  const handleInputChange = (input: string) => {
    setNftObject(input);
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
        <UserInput onInputChange={handleInputChange} />
        <NFTDisplay nftObject={nftObject} />
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default App;
