import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import Preloader from '../components/fx/Preloader';
import AuroraBackground from '../components/fx/AuroraBackground';
import CustomCursor from '../components/fx/CustomCursor';

const PublicLayout = () => (
  <>
    <AuroraBackground />
    <Preloader />
    <CustomCursor />
    <ScrollProgress />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
