import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText, ListItemIcon, ListItemButton, ListItem } from '@mui/material';

// assets
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import Cookies from 'js-cookie';
import { Divider } from 'antd';

// ==============================|| PROFILE SECTION ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const username = localStorage.getItem('username');


  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleLogoutClick= (event, index) => {
    Cookies.remove('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('menu');

    window.location.href = '/';
  };


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Profile"
        onClick={handleToggle}
        color="inherit"
      >
        <AccountCircleTwoToneIcon sx={{ fontSize: '1.6rem' }} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                {/* <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        
                    <ListItemText primary={username} />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                    <ListItemIcon>
                      <DraftsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Messages" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                    <ListItemIcon>
                      <LockOpenTwoTone />
                    </ListItemIcon>
                    <ListItemText primary="Lock Screen" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 4} onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List> */}

                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  {/* Dòng hiển thị Full Name */}
                  <ListItem
                    sx={{
                      cursor: 'default',
                      pointerEvents: 'none',
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                    }}
                  >
                    <ListItemText
                      primary={username}
                      secondary={`@${username}`}
                    />
                  </ListItem>

                  {/* Dòng kẻ phân cách */}
                  <Divider variant="middle" />

                  {/* Các mục có thể click */}
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>

                  <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                    <ListItemIcon>
                      <DraftsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Messages" />
                  </ListItemButton>

                  <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                    <ListItemIcon>
                      <LockOpenTwoTone />
                    </ListItemIcon>
                    <ListItemText primary="Lock Screen" />
                  </ListItemButton>

                  <ListItemButton selected={selectedIndex === 4} onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
