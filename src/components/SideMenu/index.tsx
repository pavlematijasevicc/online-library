import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

export default function SideMenu() {
  const [activeItem, setActiveItem] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    setActiveItem(path);
  }, [path]);

  return (
    <>
      <Drawer
        sx={{
          width: drawerOpen ? 273 : 56,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            borderRadius: "0",
            overflow: "hidden",
            width: drawerOpen ? 273 : 56,
            height: "calc(100vh - 72px)",
            justifyContent: "space-between",
            boxSizing: "border-box",
            transition: "width 0.3s",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f4f5f7", // ili zamijeni s tvojom `bg-grey-menu` bojom
            borderRight: "1px solid #d3d3d3", // `border-r-grey-line border-r-1`
          },
        }}
        variant="permanent"
        anchor="bottom"
      >
        <List>
          <ListItem
            key={"menu"}
            disablePadding
            onClick={() => setDrawerOpen((prev) => !prev)}
          >
            <ListItemButton>
              <ListItemIcon>
                {drawerOpen ? <CloseIcon /> : <MenuIcon />}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        {drawerOpen ? <Divider className="-mt-6" /> : <Divider />}
        <List>
          <Link href={"/"}>
            {activeItem === "/" ? (
              <ListItem
                key={"dashboard"}
                disablePadding
                className="bg-active text-blue"
              >
                <ListItemButton>
                  <ListItemIcon>
                    {activeItem === "/" ? (
                      <DashboardIcon
                        className={
                          activeItem === "/" ? "text-blue" : "text-grey-text"
                        }
                      />
                    ) : (
                      <DashboardIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"dashboard"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {activeItem === "/" ? (
                      <DashboardIcon
                        className={
                          activeItem === "/" ? "text-blue" : "text-grey-text"
                        }
                      />
                    ) : (
                      <DashboardIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
          <Link href={"/librarians"}>
            {activeItem === "/librarians" ? (
              <ListItem
                key={"librarians"}
                disablePadding
                className=" bg-active text-blue "
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon
                      className={
                        activeItem === "/librarians"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Bibliotekari"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"librarians"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon
                      className={
                        activeItem === "/librarians"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Bibliotekari"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
          <Link href={"/students"}>
            {activeItem === "/students" ? (
              <ListItem
                key={"students"}
                disablePadding
                className=" bg-active text-blue"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <GroupsIcon
                      className={
                        activeItem === "/students"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Ucenici"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"students"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <GroupsIcon
                      className={
                        activeItem === "/students"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Ucenici"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
          <Link href={"/books"}>
            {activeItem === "/books" ? (
              <ListItem
                key={"books"}
                disablePadding
                className=" bg-active text-blue"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <MenuBookIcon
                      className={
                        activeItem === "/books" ? "text-blue" : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Knjige"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"books"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MenuBookIcon
                      className={
                        activeItem === "/books" ? "text-blue" : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Knjige"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
          <Link href={"/authors"}>
            {activeItem === "/authors" ? (
              <ListItem
                key={"authors"}
                disablePadding
                className=" bg-active text-blue"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ClassOutlinedIcon
                      className={
                        activeItem === "/authors"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Autori"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"autorhs"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ClassOutlinedIcon
                      className={
                        activeItem === "/authors"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Autori"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>

          <Link href={"/publication"}>
            {activeItem === "/publication" ? (
              <ListItem
                key={"publication"}
                disablePadding
                className=" mb-120 bg-active text-blue"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <SwapHorizIcon
                      className={
                        activeItem === "/publication"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Izdavanje knjiga"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"publication"} disablePadding className="mb-115">
                <ListItemButton>
                  <ListItemIcon>
                    <SwapHorizIcon
                      className={
                        activeItem === "/publication"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Izdavanje knjiga"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
          <Divider />
          <Link href={"/settings"}>
            {activeItem === "/settings" ? (
              <ListItem
                key={"settings"}
                disablePadding
                className=" text-blue bg-active"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsIcon
                      className={
                        activeItem === "/settings"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={"settings"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsIcon
                      className={
                        activeItem === "/settings"
                          ? "text-blue"
                          : "text-grey-text"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
        </List>
      </Drawer>
    </>
  );
}
