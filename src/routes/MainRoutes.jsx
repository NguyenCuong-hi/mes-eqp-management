import React, { lazy, useEffect, useRef, useState } from 'react';

// project import
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
const { Content } = Layout;
import { Suspense } from 'react';

import Sidebar from 'layout/MainLayout/Sidebar';
import Header from 'layout/MainLayout/Header';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'component/Loader/load';

const DynamicTabContent = lazy(() => import('layout/MainLayout/DynamicTabs'));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = () => {

  const location = useLocation();


  // const [collapsed, setCollapsed] = useState(() => {
  //   const savedState = localStorage.getItem('COLLAPSED_STATE')
  //   return savedState ? JSON.parse(savedState) : false
  // })

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const dispatch = useDispatch();
  const tabList = useSelector((state) => state.tab.tabList);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlTab = searchParams.get('tab');

    if (urlTab && tabList.some((tab) => tab.key === urlTab)) {
      dispatch(setActiveTab(urlTab));
    }
  }, [location.search, tabList, dispatch]);

  const sidebarWidth = drawerOpen === false ? 0 : 260;

  return (
    <Layout className="h-screen w-full overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-[1001] bg-white">
        <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      </div>

      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} sidebarWidth={sidebarWidth} />

      <div className=" mt-4 w-full h-screen overflow-y-auto bg-slate-100 transition-all duration-300">
        <Content className=" min-h-full">
          <Suspense fallback={<Spinner />}>
            <DynamicTabContent />
          </Suspense>
        </Content>
      </div>
    </Layout>
  );
};

export default MainRoutes;
