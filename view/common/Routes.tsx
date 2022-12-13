import _React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import DevPage from "../pages/dev";
import Fallback from "./Fallback";

const Index = lazy(() => import("../pages/index"));
const Signin = lazy(() => import("../pages/signin"));
const Signup = lazy(() => import("../pages/signup"));
const Shop = lazy(() => import("../pages/shop"));
const ShopDetail = lazy(() => import("../pages/shopDetail"));
const Device = lazy(() => import("../pages/device"));
const DeviceDetail = lazy(() => import("../pages/deviceDetail"));
const DeviceState = lazy(() => import("../pages/state"));
const Ware = lazy(() => import("../pages/ware"));
const Board = lazy(() => import("../pages/board"));
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
        <Route path="/device" element={<Device />} />
        <Route path="/device/:id" element={<DeviceDetail />} />
        <Route path="/state" element={<DeviceState />} />
        <Route path="/ware" element={<Ware />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<DevPage />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Suspense>
  );
}
