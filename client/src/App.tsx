import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import UserInput from './component/UserInput';
import NFTDisplay from './component/NFTDisplay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [nftObject, setNftObject] = useState<string>('');

  const handleInputChange = (input: string) => {
    setNftObject(input);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sui NFT Spam Detect Bot
        </Typography>
        <UserInput onInputChange={handleInputChange} />
        <NFTDisplay nftObject={nftObject} />
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default App;
