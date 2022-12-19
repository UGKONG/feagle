import _React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Fallback from "./Fallback";
import DevPage from "../pages/dev";

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

export default function Router() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/model" element={<Model />} />
        <Route path="/device" element={<Device />} />
        <Route path="/device/:id" element={<DeviceDetail />} />
        <Route path="/state" element={<DeviceState />} />
        <Route path="/ware" element={<Ware />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/add" element={<BoardCreate />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Suspense>
  );
}
