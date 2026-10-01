import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../components/ui/Toast';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import { FiSend } from 'react-icons/fi';

const initialState = { name: '', email: '', subject: '', message: '', company: '' };

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Please enter a valid email.';
  if (values.subject.trim().length < 2) errors.subject = 'Please add a subject.';
  if (values.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
};

const Contact = () => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { data } = await api.post('/messages', values);
      showToast(data.message || "Thanks for reaching out — I'll get back to you soon.");
      setValues(initialState);
      setErrors({});
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-surface-alt py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          <SectionHeader icon={FiSend} eyebrow="Contact" title="Let's build something" />
          <div className="pointer-events-none relative mt-2 h-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute -left-10 -top-10 h-40 w-40 animate-ping rounded-full border border-signal-teal/20"
                style={{ animationDuration: '4s', animationDelay: `${i * 1.2}s` }}
              />
            ))}
          </div>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-secondary">
            Have a project, a role, or a question about a video? Send a message and I'll reply as soon
            as I can.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl bg-surface-card p-7 transition-shadow duration-500 focus-within:shadow-[0_0_50px_rgba(34,211,238,0.12)]"
          noValidate
        >
          {/* Honeypot field: hidden from real visitors via CSS, matched against
              the server's spam check. */}
          <input
            type="text"
            name="company"
            value={values.company}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <Input label="Subject" name="subject" value={values.subject} onChange={handleChange} error={errors.subject} />
          <Textarea
            label="Message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            error={errors.message}
          />
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Sending…' : 'Send Message'}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
