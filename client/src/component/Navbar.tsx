import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
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
      <AppBar position="static" className="px-4">
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Sui NFT Spam Detector
          </Typography>
          <List className="flex gap-4 items-center">
            {navItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <Link
                  variant="body2"
                  href={item.href}
                  target="_blank"
                  className="flex gap-4 items-center justify-center !text-white !text-lg !font-medium"
                >
                  {item.title} <FaExternalLinkAlt color="#fff" />
                </Link>
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
