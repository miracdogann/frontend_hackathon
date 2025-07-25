import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <Header />
      {/* header ve footer her sayfada var 
        sadece main içeriği değişiyor
    */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
