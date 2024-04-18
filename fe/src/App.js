// import packages
import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import Page_Color from './pages/Page_Color';
import MainLayout from './components/MainLayout/MainLayout';
import { useContext, useState, useEffect } from 'react';
import { Skeleton } from "antd"
// import pages
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';

import Page_Hotel_Management from './pages/Page_Hotel_Management/Page_Hotel_Management';
import Page_Hotel_Customer from './pages/Page_Hotel_Customer/Page_Hotel_Customer';
import Page_Hotel_Add_Data from './pages/Page_Hotel_Add_Data/Page_Hotel_Add_Data';
import Page_Login from './pages/Page_Login/Page_Login';
import Page_Hotel_Booking from './pages/Page_Hotel_Booking/Page_Hotel_Booking';
// import Page_Login


const App = () => {
  // search
  // router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "hotel-management",
          element: <Page_Hotel_Management />,
        },
        {
          path: "hotel-customer",
          element: <Page_Hotel_Customer />,
        },
        {
          path: "hotel-booking",
          element: <Page_Hotel_Booking />,
        },
        {
          path: "hotel-add-data",
          element: <Page_Hotel_Add_Data />,
        }
      ]
    },
    {
      path: '/login',
      element: <Page_Login />
    },
    {
      path: '/login',
      element: <Page_Login />
    }
  ]);
  return (
    <RouterProvider router={router} />
  );
};

export default App;
