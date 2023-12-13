"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  BarChartIcon,
  Heart,
  HomeIcon,
  LogOutIcon,
  SidebarIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link href="/home/">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/home/liked">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Heart />
              </ListItemIcon>
              <ListItemText primary="Liked" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/home/user">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Your Profile" />
            </ListItemButton>
          </ListItem>
        </Link>
        <a href="/logout">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LogOutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </a>
      </List>
    </Box>
  );

  return (
    <div className="leaflet-control bg-transparent relative">
      <button
        onClick={toggleDrawer("left", true)}
        className="input-shadow  text-l border bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl m-2"
      >
        <SidebarIcon />
      </button>
      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        {list("left")}
      </Drawer>
    </div>
  );
}
