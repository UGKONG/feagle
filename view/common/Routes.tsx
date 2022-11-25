import _React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Fallback from "./Fallback";

const Index = lazy(() => import("../pages/index"));
const Signin = lazy(() => import("../pages/signin"));
const Signup = lazy(() => import("../pages/signup"));
const Docs = lazy(() => import("../pages/docs"));

export default function Router() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<Index />} />
        <Route path="/useDevice" element={<Index />} />
        <Route path="/deviceState" element={<Index />} />
        <Route path="/ware" element={<Index />} />
        <Route path="/board" element={<Index />} />
        <Route path="/user" element={<Index />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Suspense>
  );
}
