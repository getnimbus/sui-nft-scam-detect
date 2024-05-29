import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Box, CardMedia } from "@mui/material";

interface UserInputProps {
  onInputChange: (input: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onInputChange }) => {
  const [input, setInput] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onInputChange(input);
  };

  return (
    <>
      <Box
        mt={8}
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        width="100%"
      >
        <TextField
          label="Enter NFT object"
          variant="outlined"
          value={input}
          onChange={handleChange}
          fullWidth
          type="search"
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          Submit
        </Button>
      </Box>
    </>
  );
};

export default UserInput;
