import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import * as Icons from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { addTab, setActiveTab } from 'store/tabsReducer';
import { useTranslation } from 'react-i18next';

const { Sider } = Layout;

const Sidebar = ({ drawerOpen, drawerToggle, sidebarWidth }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tabList, activeTabKey } = useSelector((state) => state.tab);

  const [menuItems, setMenuItems] = useState([]);

  const mapMenuItems = (items) => {
    return items.map((item) => {
      const IconComponent =
        typeof item.icon === 'string' && Icons[item.icon]
          ? Icons[item.icon]
          : null;
  
      return {
        
        key: item.key,
        label: t(item.labelLang) || item.label,
        labelLang: item.labelLang,
        icon: IconComponent ? <IconComponent /> : null,
        component: item?.component || null,
        children: Array.isArray(item.children)
          ? mapMenuItems(item.children)
          : '',
      };
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('menu-item');
    if (stored) {
      try {
        const rawItems = JSON.parse(stored);
        const formattedMenu = mapMenuItems(rawItems);
        setMenuItems(formattedMenu);
      } catch (err) {
        console.error('Failed to parse menuItems:', err);
      }
    }
  }, []);

  const siderStyle = {
    overflowY: 'scroll',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarGutter: 'stable',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const findMenuItemByKey = (items, targetKey) => {
    for (const item of items) {
      if (item.key === targetKey) {
        return item;
      }

      if (item.children) {
        const found = findMenuItemByKey(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  const handleMenuClick = ({ key }) => {
    const menuItem = findMenuItemByKey(menuItems, key);
    if (!menuItem) return;

    if (!tabList.some((tab) => tab.key === key)) {
      dispatch(
        addTab({
          key: key,
          label: menuItem.label,
          component: menuItem.component,
          permission: menuItem.permission,
          labelLang: menuItem.labelLang
        })
      );
    }

    dispatch(setActiveTab(key));
  };

  return (


    <Sider
      collapsible={true}
      collapsed={!drawerOpen}
      onCollapse={(collapsed) => drawerToggle(!collapsed)}
      width={sidebarWidth}
      style={siderStyle}
      className="bg-white"
      trigger={null}
    >

        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          className="border-none"
          items={menuItems}
          onClick={handleMenuClick}
        />


    </Sider>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func
};

export default Sidebar;
