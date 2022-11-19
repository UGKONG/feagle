import _React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Fallback from "./Fallback";

const Index = lazy(() => import("../pages/index"));
const Login = lazy(() => import("../pages/login"));

export default function Router() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Suspense>
  );
}
