import { useState } from "react";
import { Button, Collapse, List, ListItem } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const ExampleID = ({ setInput, inputItem }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="">
      <div
        className="flex justify-between border-b items-center p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-sm font-medium">{inputItem.label}</h3>
        <div>{open ? <FaAngleUp /> : <FaAngleDown />}</div>
      </div>
      <div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {inputItem.listItems.map((item: any) => {
              return (
                <ListItem disablePadding key={item}>
                  <Button
                    type="submit"
                    onClick={() => {
                      setInput(item);
                    }}
                    className="hover:!bg-blue-100 rounded-md !py-2 !px-2 text-ellipsis overflow-hidden whitespace-nowrap text-left"
                    key={item}
                  >
                    {item}
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </div>
    </div>
  );
};

export default ExampleID;
