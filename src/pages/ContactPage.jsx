// src/pages/ContactPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Contact.css';

const PROJECT_TYPES = ['UI/UX Design', 'Branding', 'Design System', 'Consultancy', 'Other'];

const CustomSelect = ({ value, onChange, disabled, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="cs-wrap" ref={ref}>
      <button
        type="button"
        className={`contact-input cs-trigger ${open ? 'cs-open' : ''} ${error ? 'cs-error' : ''} ${disabled ? 'cs-disabled' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
      >
        <span className={value ? 'cs-value' : 'cs-placeholder'}>
          {value || 'Select a type...'}
        </span>
        <svg className={`cs-chevron ${open ? 'cs-chevron-up' : ''}`} viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ul className="cs-dropdown">
          {PROJECT_TYPES.map(type => (
            <li
              key={type}
              className={`cs-option ${value === type ? 'cs-selected' : ''}`}
              onClick={() => { onChange(type); setOpen(false); }}
            >
              {type}
              {value === type && (
                <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
                  <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.project_type) errors.project_type = 'Please select a project type.';
  if (!form.message.trim()) errors.message = 'Message is required.';
  else if (form.message.trim().length < 10) errors.message = 'Message is too short (min 10 characters).';
  return errors;
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', project_type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStatus('loading');
    try {
      // 1. Salva in Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([form]);
      if (dbError) throw dbError;

      // 2. Manda email via Edge Function
      await supabase.functions.invoke('send-contact-email', {
        body: form,
      });

      setStatus('success');
      setForm({ name: '', email: '', project_type: '', message: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="contact-header">
          <h1 className="contact-title">Let's work together</h1>
        </div>

        {status === 'success' ? (
          <div className="contact-success">
            <span className="contact-success-icon">✓</span>
            <h2>Message sent!</h2>
            <p>Thanks for reaching out — I'll get back to you soon.</p>
            <button className="contact-reset" onClick={() => setStatus('idle')}>Send another message</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-row">
              <div className="contact-field">
                <label className="contact-label" htmlFor="name">Name</label>
                <input
                  id="name" name="name" type="text"
                  className={`contact-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="email">Email</label>
                <input
                  id="email" name="email" type="email"
                  className={`contact-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label">Project type</label>
              <CustomSelect
                value={form.project_type}
                onChange={(val) => {
                  setForm(prev => ({ ...prev, project_type: val }));
                  if (errors.project_type) setErrors(prev => ({ ...prev, project_type: '' }));
                }}
                disabled={status === 'loading'}
                error={!!errors.project_type}
              />
              {errors.project_type && <span className="field-error">{errors.project_type}</span>}
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="message">Message</label>
              <textarea
                id="message" name="message"
                className={`contact-input contact-textarea ${errors.message ? 'input-error' : ''}`}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={handleChange}
                rows={6}
                disabled={status === 'loading'}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            {status === 'error' && <p className="contact-error">Something went wrong. Please try again.</p>}

            <button type="submit" className="contact-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send message →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;