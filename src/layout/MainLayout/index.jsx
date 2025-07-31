import React from 'react';
import { Outlet, Router, Link as RouterLink } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import { drawerWidth } from 'config.js';
import Header from './Header';
import Sidebar from './Sidebar';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100%',
  flexGrow: 1,
  marginTop: 40,
  paddingTop: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2)
  },
  padding: theme.spacing(1),
  paddingTop: 0,
  height: '100%'

}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    setDrawerOpen(matchUpLg);
  }, [matchUpLg]);




  return (
    <div className="flex w-full">
      <div className="fixed z-[1000] bg-white w-full">
        <div className="min-h-[30px] flex items-center">
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </div>
      </div>

      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />

      <main
        className={`flex-grow w-full min-h-screen transition-all ${drawerOpen ? 'ml-0' : 'ml-[240px]'
          }`}
      >
        <div className="p-2 pt-0 h-full overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
