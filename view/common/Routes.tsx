import _React, { lazy, Suspense, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Store } from "../../functions/store";
import Fallback from "./Fallback";
import Container from "./Container";

const Index = lazy(() => import("../pages/index"));
const Signin = lazy(() => import("../pages/signin"));
const Signup = lazy(() => import("../pages/signup"));
const Shop = lazy(() => import("../pages/shop"));
const ShopDetail = lazy(() => import("../pages/shopDetail"));
const Model = lazy(() => import("../pages/model"));
const Device = lazy(() => import("../pages/device"));
const DeviceDetail = lazy(() => import("../pages/deviceDetail"));
const DeviceState = lazy(() => import("../pages/state"));
const Ware = lazy(() => import("../pages/ware"));
const Board = lazy(() => import("../pages/board"));
const BoardDetail = lazy(() => import("../pages/boardDetail"));
const BoardCreate = lazy(() => import("../pages/boardCreate"));
const User = lazy(() => import("../pages/user"));
const Dev = lazy(() => import("../pages/dev"));

export default function Router() {
  const loginUser = useSelector((x: Store) => x?.master);

  const isLogin = useMemo<boolean>(
    () => (loginUser ? true : false),
    [loginUser]
  );

  const isNone = (component: JSX.Element) => {
    return isLogin ? component : <Container />;
  };

  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={isNone(<Index />)} />
        <Route path="/shop" element={isNone(<Shop />)} />
        <Route path="/shop/:id" element={isNone(<ShopDetail />)} />
        <Route path="/model" element={isNone(<Model />)} />
        <Route path="/device" element={isNone(<Device />)} />
        <Route path="/device/:id" element={isNone(<DeviceDetail />)} />
        <Route path="/state" element={isNone(<DeviceState />)} />
        <Route path="/ware" element={isNone(<Ware />)} />
        <Route path="/board" element={isNone(<Board />)} />
        <Route path="/board/add" element={isNone(<BoardCreate />)} />
        <Route path="/board/:id" element={isNone(<BoardDetail />)} />
        <Route path="/user" element={isNone(<User />)} />
        <Route path="/dev" element={isNone(<Dev />)} />
      </Routes>
    </Suspense>
  );
}
