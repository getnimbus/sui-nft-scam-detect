import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import ExampleID from "./ExampleID";
import { toast } from "react-toastify";

interface UserInputProps {
  onInputChange: (input: string) => void;
}

const listTestId = [
  {
    label: "Example Spam Address:",
    listItems: [
      "0x2bb452d337fd9508b83df4a6e028362510102f9048daa351ffbd7ef7db6a6aa6",
      "0x001d09bd0d937084c7132be58fb0b65aa44c2dafeb4df94b711905461c3e0bce",
    ],
  },
  {
    label: "Example Verified Address:",
    listItems: [
      "0xc7c29e000a6b7e089ab59aecf38a86d5bd0cd2ed3c55ccec7b97debe717bd70a",
    ],
  },
];

const UserInput: React.FC<UserInputProps> = ({ onInputChange }) => {
  const [input, setInput] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === "") {
      toast.error("Your didn't type your address yet!");
    } else {
      onInputChange(input);
    }
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
      <Box component="form" onSubmit={handleSubmit} width="100%">
        {listTestId.map((item: any, index: number) => {
          return <ExampleID setInput={setInput} inputItem={item} key={index} />;
        })}
      </Box>
    </>
  );
};

export default UserInput;
