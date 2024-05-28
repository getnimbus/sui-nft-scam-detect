import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface UserInputProps {
  onInputChange: (input: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onInputChange }) => {
  const [input, setInput] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onInputChange(input);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <TextField
        label="Enter NFT object"
        variant="outlined"
        value={input}
        onChange={handleChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default UserInput;
