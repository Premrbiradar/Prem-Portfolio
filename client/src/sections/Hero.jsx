import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import useFetch from "../hooks/useFetch";
import { useFinePointer } from "../hooks/useFinePointer";
import Button from "../components/ui/Button";
import Magnetic from "../components/fx/Magnetic";
import ParticleField from "../components/fx/ParticleField";
import ScrambleText from "../components/fx/ScrambleText";
import { introDelay } from "../components/fx/Preloader";
import defaultPhoto from "../assets/profile-primary.jpg";
import {
  FiLinkedin,
  FiGithub,
  FiYoutube,
  FiMail,
  FiArrowUpRight,
} from "react-icons/fi";

const socialIcon = {
  linkedin: <FiLinkedin className="h-[18px] w-[18px]" />,
  github: <FiGithub className="h-[18px] w-[18px]" />,
  youtube: <FiYoutube className="h-[18px] w-[18px]" />,
  email: <FiMail className="h-[18px] w-[18px]" />,
};

const CODE_LINE = "const developer = require('prem-biradar');";

// Types the line out once, then leaves a blinking caret.
const TypedLine = ({ startAfter }) => {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? CODE_LINE.length : 0);

  useEffect(() => {
    if (reduce) return undefined;
    let id;
    const start = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c >= CODE_LINE.length) {
            clearInterval(id);
            return c;
          }
          return c + 1;
        });
      }, 42);
    }, startAfter);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [reduce, startAfter]);

  return (
    <p className="font-code text-sm text-accent-teal" aria-label={CODE_LINE}>
      {CODE_LINE.slice(0, count)}
      <span className="animate-blink">|</span>
    </p>
  );
};

// A floating tech chip that shifts with the cursor at its own depth.
const Chip = ({
  px,
  py,
  depth,
  className = "",
  inner,
  delay = 0,
  children,
}) => {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 ${className}`}>
      <div
        className={
          inner ||
          "animate-float rounded-lg border border-subtle bg-paper-50/90 px-3 py-1.5 font-code text-xs text-primary shadow-lg backdrop-blur dark:bg-ink-800/90"
        }
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    </motion.div>
  );
};

const Corner = ({ pos }) => (
  <span
    aria-hidden="true"
    className={`absolute h-7 w-7 scale-75 border-signal-teal opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 ${pos}`}
  />
);

const HeroPortrait = ({ photo, name, delay }) => {
  const enabled = useFinePointer();
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 16 });
  const sy = useSpring(y, { stiffness: 140, damping: 16 });
  const sh = useSpring(hover, { stiffness: 160, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-15, 15]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const px = useTransform(sx, [0, 1], [-1, 1]);
  const py = useTransform(sy, [0, 1], [-1, 1]);
  const imgX = useTransform(px, (v) => v * -12);
  const imgY = useTransform(py, (v) => v * -12);
  const glowX = useTransform(px, (v) => v * 34);
  const glowY = useTransform(py, (v) => v * 34);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(280px circle at ${gx} ${gy}, rgba(255,255,255,0.32), transparent 60%)`;
  const tint = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(34,211,238,0.20), transparent 70%)`;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const onEnter = () => enabled && hover.set(1);
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
    hover.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1,
        delay: delay + 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto w-full max-w-sm [perspective:1200px] lg:max-w-md xl:max-w-lg"
    >
      <motion.div
        aria-hidden="true"
        style={{ x: glowX, y: glowY }}
        className="absolute -inset-6 -z-10 animate-pulse-glow rounded-[2.5rem] bg-gradient-to-br from-signal-teal/30 via-transparent to-brass/30 blur-3xl"
      />

      <div className="animate-float-slow">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={
            enabled
              ? { rotateX, rotateY, transformStyle: "preserve-3d" }
              : undefined
          }
          className="group relative"
        >
          <div className="relative overflow-hidden rounded-2xl p-[2px]">
            <div className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#22D3EE_70deg,transparent_140deg,#FB923C_230deg,transparent_300deg)] transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-2xl bg-paper-50 p-2 dark:bg-ink-900">
              <div className="relative overflow-hidden rounded-xl">
                <motion.div style={{ x: imgX, y: imgY, scale: 1.12 }}>
                  <img
                    src={photo}
                    fetchpriority="high"
                    alt={`Portrait of ${name}`}
                    className="aspect-[4/5] w-full object-cover object-[50%_25%] transition duration-700 group-hover:scale-105 group-hover:contrast-105 group-hover:saturate-[1.18]"
                  />
                </motion.div>

                {/* cursor-following light: teal tint + white glare */}
                <motion.div
                  aria-hidden="true"
                  style={{ background: tint, opacity: sh }}
                  className="pointer-events-none absolute inset-0"
                />
                <motion.div
                  aria-hidden="true"
                  style={{
                    background: glare,
                    opacity: sh,
                    mixBlendMode: "overlay",
                  }}
                  className="pointer-events-none absolute inset-0"
                />

                {/* scan line sweeps while hovering */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-signal-teal/30 to-transparent opacity-0 group-hover:animate-scan group-hover:opacity-100"
                />

                {/* HUD corner brackets */}
                <Corner pos="left-4 top-4 border-l-2 border-t-2" />
                <Corner pos="right-4 top-4 border-r-2 border-t-2" />
                <Corner pos="bottom-4 left-4 border-b-2 border-l-2" />
                <Corner pos="bottom-4 right-4 border-b-2 border-r-2" />

                {/* caption slides up on hover */}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-8 rounded-lg bg-ink-950/75 px-4 py-3 opacity-0 backdrop-blur-md transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-sm font-medium text-paper-50">
                    {name}
                  </p>
                  <p className="font-code text-[11px] text-signal-teal">
                    MERN Stack Developer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Chip
        px={px}
        py={py}
        depth={26}
        delay={0}
        className="-left-7 top-10 hidden sm:block"
      >
        React
      </Chip>
      <Chip
        px={px}
        py={py}
        depth={-22}
        delay={1.2}
        className="-right-7 top-28 hidden sm:block"
      >
        Node.js
      </Chip>
      <Chip
        px={px}
        py={py}
        depth={30}
        delay={2.1}
        className="-right-4 bottom-44 hidden sm:block"
      >
        MongoDB
      </Chip>
      <Chip
        px={px}
        py={py}
        depth={-28}
        delay={0.6}
        className="-left-9 bottom-52 hidden sm:block"
      >
        Express
      </Chip>
      <Chip
        px={px}
        py={py}
        depth={-18}
        delay={0.3}
        className="-bottom-6 -left-6 hidden sm:block"
        inner="w-56 animate-float-slow rounded-lg border border-subtle bg-paper-50/95 p-4 shadow-lg backdrop-blur dark:bg-ink-800/95"
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <p className="mt-2 font-code text-[11px] leading-relaxed text-secondary">
          <span className="text-accent-teal">stack</span>: [React, Node,
          <br />
          Express, MongoDB]
        </p>
      </Chip>
    </motion.div>
  );
};

const Hero = () => {
  const { data: profile } = useFetch("/profile", null);
  const delay = useMemo(() => introDelay(), []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const name = profile?.name || "Prem Biradar";
  const shortName = name
    .split(" ")
    .filter(Boolean)
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join(" ");
  const photo = profile?.profilePhotoUrl || defaultPhoto;
  const socials = [
    profile?.linkedin && {
      key: "linkedin",
      href: profile.linkedin,
      label: "LinkedIn",
    },
    profile?.github && { key: "github", href: profile.github, label: "GitHub" },
    profile?.youtube && {
      key: "youtube",
      href: profile.youtube,
      label: "YouTube",
    },
    profile?.email && {
      key: "email",
      href: `mailto:${profile.email}`,
      label: "Email",
    },
  ].filter(Boolean);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.13, delayChildren: delay + 0.15 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-surface pt-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-96 w-96 animate-drift rounded-full bg-signal-teal/20 blur-3xl dark:bg-signal-teal/[0.12]" />
        <div
          className="absolute -right-24 bottom-0 h-96 w-96 animate-drift rounded-full bg-brass/20 blur-3xl dark:bg-brass/[0.12]"
          style={{ animationDelay: "-7s" }}
        />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 animate-pulse-glow rounded-full bg-signal-teal/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            color: "rgba(120,130,145,0.25)",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          }}
        />
        <ParticleField className="absolute inset-0" />
      </div>

      <div className="section-shell grid items-center gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <TypedLine startAfter={(delay + 0.4) * 1000} />
          <motion.h1
            variants={item}
            className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-primary sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Hi, I'm <span className="text-gradient-animated">Prem Biradar</span>
          </motion.h1>
          <motion.p variants={item} className="mt-4 text-lg text-accent-teal">
            {profile?.title || "Full Stack Developer"} |{" "}
            {profile?.secondaryTitle || "MERN Stack Developer"}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-5 max-w-prose text-base leading-relaxed text-secondary"
          >
            {profile?.heroIntro ||
              "I build scalable, responsive and production-ready web applications using modern JavaScript technologies, while also creating informative historical, geographical and documentary content on YouTube."}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button onClick={() => scrollTo("resume")}>
                View Resume <FiArrowUpRight className="h-4 w-4" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="ghost" onClick={() => scrollTo("projects")}>
                View Projects
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="ghost" onClick={() => scrollTo("contact")}>
                Contact Me
              </Button>
            </Magnetic>
            {profile?.youtube && (
              <Magnetic>
                <Button
                  as="a"
                  href={profile.youtube}
                  target="_blank"
                  rel="noreferrer"
                  variant="brass"
                >
                  <FiYoutube className="h-4 w-4" /> Watch on YouTube
                </Button>
              </Magnetic>
            )}
          </motion.div>

          {socials.length > 0 && (
            <motion.div
              variants={item}
              className="mt-8 flex items-center gap-3"
            >
              {socials.map((s) => (
                <Magnetic key={s.key} strength={0.5}>
                  <a
                    href={s.href}
                    target={s.key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle text-secondary transition-all duration-300 hover:scale-110 hover:border-accent-teal hover:text-accent-teal hover:shadow-[0_0_22px_rgba(34,211,238,0.4)]"
                  >
                    {socialIcon[s.key]}
                  </a>
                </Magnetic>
              ))}
            </motion.div>
          )}
        </motion.div>

        <HeroPortrait photo={photo} name={name} delay={delay} />
      </div>
    </section>
  );
};

export default Hero;
