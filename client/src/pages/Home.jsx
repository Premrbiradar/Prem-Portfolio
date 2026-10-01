import React from 'react';
import Hero from '../sections/Hero';
import Marquee from '../components/fx/Marquee';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Experience from '../sections/Experience';
import Projects from '../sections/Projects';
import YouTubeSection from '../sections/YouTubeSection';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';

const Home = () => (
  <>
    <Hero />
    <Marquee />
    <About />
    <Skills />
    <Experience />
    <Projects />
    <YouTubeSection />
    <Resume />
    <Contact />
  </>
);

export default Home;
