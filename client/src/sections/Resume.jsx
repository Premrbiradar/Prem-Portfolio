import React from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import SectionHeader from '../components/ui/SectionHeader';
import { FiFileText } from 'react-icons/fi';
import TiltCard from '../components/fx/TiltCard';
import Magnetic from '../components/fx/Magnetic';

const Resume = () => {
  const { data: resume, loading } = useFetch('/resume', null);

  return (
    <section id="resume" className="bg-surface py-24">
      <div className="section-shell">
        <SectionHeader icon={FiFileText} eyebrow="Resume" title="Take a closer look" />

        {loading && <Skeleton className="mt-8 h-32 max-w-xl" />}

        {!loading && (
          <TiltCard
            max={5}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 flex max-w-2xl flex-col gap-5 rounded-xl bg-surface-card p-7 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-lg font-medium text-primary">
                {resume?.fileName || 'Resume not uploaded yet'}
              </p>
              <p className="mt-1 text-sm text-secondary">
                {resume ? 'Full experience, skills and education in one PDF.' : 'Add a resume from the Admin Panel.'}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <Magnetic>
                <Button
                  as="a"
                  href={resume?.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                  aria-disabled={!resume}
                  className={!resume ? 'pointer-events-none opacity-50' : ''}
                >
                  View Resume
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  as="a"
                  href={resume?.fileUrl}
                  download={resume?.fileName}
                  aria-disabled={!resume}
                  className={!resume ? 'pointer-events-none opacity-50' : ''}
                >
                  Download Resume
                </Button>
              </Magnetic>
            </div>
          </TiltCard>
        )}
      </div>
    </section>
  );
};

export default Resume;
