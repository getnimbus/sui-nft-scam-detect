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
  { title: "About", href: "https://getnimbus.io" },
  { title: "Github", href: "https://github.com/getnimbus" },
];

export const FNavbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>

          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Sui NFT Spam Detector
          </Typography>
          <List className="flex gap-4 items-center">
            {navItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemText>{item.title}</ListItemText>
                <ListItemButton sx={{ textAlign: "center" }}>
                  <a href={item.href} target="_blank">
                    <FaExternalLinkAlt color="#fff" />
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
