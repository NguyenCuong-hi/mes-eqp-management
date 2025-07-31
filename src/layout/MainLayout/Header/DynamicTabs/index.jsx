import React from 'react';
import { Tabs, Tab, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { removeTab, setActiveTab } from 'store/tabsReducer';

const DynamicTabs = () => {
  const dispatch = useDispatch();
  const { tabList, activeTabKey } = useSelector((state) => state.tab);

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  const handleCloseTab = (e, key) => {
    e.stopPropagation();
    dispatch(removeTab(key));
  };


  return (
    <Box>
      <Tabs
        value={activeTabKey}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: '48px', borderBottom: 1, borderColor: 'divider' }}
      >
        {tabList.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            label={
              <Box display="flex" alignItems="center">
                {tab.label}
                {tab.key !== 'home' && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleCloseTab(e, tab.key)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
            sx={{ minHeight: '48px', textTransform: 'none' }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default DynamicTabs;
