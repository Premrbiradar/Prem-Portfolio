import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import TiltCard from '../components/fx/TiltCard';
import Magnetic from '../components/fx/Magnetic';
import { FiFilm } from 'react-icons/fi';

const CATEGORIES = ['All', 'History', 'Geography', 'Documentary', 'Informative', 'Other'];
const BRASS_GLOW = 'rgba(251,146,60,0.25)';

const getVideoId = (url = '') => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

const thumbFor = (video) => {
  const id = getVideoId(video.youtubeUrl);
  return video.thumbnailUrl || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '');
};

const PlayButton = ({ size = 'h-12 w-12', pulse }) => (
  <span className={`relative flex ${size} items-center justify-center rounded-full bg-brass text-ink-950`}>
    {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-brass/50" />}
    <span className="relative">▶</span>
  </span>
);

const VideoCard = ({ video, onWatch, index }) => {
  const thumb = thumbFor(video);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard glow={BRASS_GLOW} max={8} className="group overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
        <button onClick={() => onWatch(video)} className="block w-full">
          <div className="relative aspect-video w-full overflow-hidden bg-ink-800">
            {thumb ? (
              <img
                src={thumb}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-paper-400">No thumbnail</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/40">
              <span className="scale-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <PlayButton pulse />
              </span>
            </div>
          </div>
        </button>
        <div className="p-5">
          <span className="text-xs font-medium text-brass">{video.category}</span>
          <h3 className="mt-1.5 font-display text-base font-medium text-paper-50">{video.title}</h3>
          {video.description && <p className="mt-1.5 line-clamp-2 text-sm text-paper-400">{video.description}</p>}
          <Button
            variant="ghost"
            className="mt-4 !border-brass/40 !text-brass hover:!border-brass"
            onClick={() => onWatch(video)}
          >
            Watch
          </Button>
        </div>
      </TiltCard>
    </motion.div>
  );
};

const YouTubeSection = () => {
  const { data: videos, loading } = useFetch('/youtube', []);
  const { data: profile } = useFetch('/profile', null);
  const [category, setCategory] = useState('All');
  const [playingId, setPlayingId] = useState(null);

  const featured = useMemo(() => videos.find((v) => v.featured) || videos[0], [videos]);
  const grid = useMemo(
    () =>
      (category === 'All' ? videos : videos.filter((v) => v.category === category)).filter(
        (v) => v._id !== featured?._id
      ),
    [videos, category, featured]
  );

  // The iframe only loads once someone chooses to watch, never up front.
  const handleWatch = (video) => {
    setPlayingId(video._id);
    if (!getVideoId(video.youtubeUrl)) window.open(video.youtubeUrl, '_blank');
  };

  return (
    <section id="youtube" className="relative overflow-hidden bg-ink-950 py-28">
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 animate-drift rounded-full bg-brass/15 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 animate-drift rounded-full bg-brass/10 blur-3xl"
        style={{ animationDelay: '-8s' }}
      />

      <div className="section-shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-brass/40 bg-brass/10 text-brass">
                <FiFilm className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm text-brass">Beyond Code</span>
            </motion.div>
            <h2 aria-label="My YouTube Journey" className="mt-3 font-display text-3xl font-semibold text-paper-50 sm:text-4xl lg:text-5xl">
              {'My YouTube Journey'.split(' ').map((w, i) => (
                <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '115%', rotate: 4 }}
                    whileInView={{ y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.07 * i, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h2>
            <p className="mt-3 text-sm text-paper-400">
              {profile?.youtubeTagline || 'History • Geography • Documentaries • Stories'}
            </p>
          </div>
          {profile?.youtube && (
            <Magnetic>
              <Button as="a" href={profile.youtube} target="_blank" rel="noreferrer" variant="brass">
                Visit YouTube Channel
              </Button>
            </Magnetic>
          )}
        </div>

        {loading && (
          <div className="mt-10">
            <Skeleton className="h-80" />
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-ink-700 p-10 text-center">
            <p className="font-display text-base text-paper-50">Videos coming soon</p>
            <p className="mt-2 text-sm text-paper-400">
              Add videos from the Admin Panel, and mark one as Featured to showcase it here.
            </p>
          </div>
        )}

        {!loading && featured && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid gap-8 rounded-xl border border-ink-700 bg-ink-900 p-6 shadow-2xl shadow-brass/5 lg:grid-cols-2 lg:p-8"
          >
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-ink-800">
              {playingId === featured._id && getVideoId(featured.youtubeUrl) ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${getVideoId(featured.youtubeUrl)}?autoplay=1`}
                  title={featured.title}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button onClick={() => handleWatch(featured)} className="group relative block h-full w-full overflow-hidden">
                  <img
                    src={thumbFor(featured)}
                    alt={featured.title}
                    className="h-full w-full animate-kenburns object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink-950/25 transition-colors group-hover:bg-ink-950/45">
                    <span className="transition-transform duration-300 group-hover:scale-125">
                      <PlayButton size="h-16 w-16" pulse />
                    </span>
                  </span>
                </button>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs font-medium text-brass">{featured.category}</span>
              <h3 className="mt-2 font-display text-2xl font-medium text-paper-50">{featured.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper-400">{featured.description}</p>
              <Magnetic className="mt-5 w-fit">
                <Button variant="brass" onClick={() => handleWatch(featured)}>
                  Watch Now
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        )}

        {!loading && videos.length > 1 && (
          <>
            <div className="mt-16 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    category === c ? 'border-transparent text-brass' : 'border-ink-700 text-paper-400 hover:text-paper-50'
                  }`}
                >
                  {category === c && (
                    <motion.span
                      layoutId="yt-filter-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full border border-brass bg-brass/10"
                    />
                  )}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((video, i) => (
                <VideoCard key={video._id} video={video} onWatch={handleWatch} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default YouTubeSection;
