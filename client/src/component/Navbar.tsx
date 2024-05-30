import {
  AppBar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { FaExternalLinkAlt } from "react-icons/fa";

const navItems = [
  { title: "Github", href: "https://github.com/getnimbus", internal: false },
];

export const FNavbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Sui NFT Spam Detector
          </Typography>
          <List className="flex gap-4 items-center">
            {navItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemText>{item.title}</ListItemText>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <a href={item.href} target="_blank">
                    {!item.internal && <FaExternalLinkAlt color="#fff" />}
                  </a>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
