import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FiSave, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Header from '../header'
import './editor.css';

const EditorPage = () => {
  const [formData, setFormData] = useState({
    about: 'a1',
    footer: 'a1',
    header: 'a1',
    landing: 'a1',
    plan: 'a1',
    police: 'a1'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('home')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            about: data.about || 'a1',
            footer: data.footer || 'a1',
            header: data.header || 'a1',
            landing: data.landing || 'a1',
            plan: data.plan || 'a1',
            police: data.police || 'a1'
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('home')
        .upsert([formData], { onConflict: ['id'] });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editor-container loading">
        <div className="loading-spinner">
          <FiLoader className="spin" />
        </div>
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <h1>Content Editor</h1>
      <p className="editor-description">
        Edit the available content options for your application.
      </p>

      {error && (
        <div className="alert error">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert success">
          <FiCheckCircle />
          <span>Changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Header Section */}
          <div className="form-section">
            <h2>Header Options</h2>
            <div className="form-group">
              <label>Header Style</label>
              <select
                name="header"
                value={formData.header}
                onChange={handleChange}
                className="form-select"
              >
                {['a1', 'a2'].map(option => (
                  <option key={option} value={option}>
                    Option {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Landing Section */}
          <div className="form-section">
            <h2>Landing Page</h2>
            <div className="form-group">
              <label>Landing Style</label>
              <select
                name="landing"
                value={formData.landing}
                onChange={handleChange}
                className="form-select"
              >
                {['a1', 'a2'].map(option => (
                  <option key={option} value={option}>
                    Option {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* About Section */}
          <div className="form-section">
            <h2>About Section</h2>
            <div className="form-group">
              <label>About Style</label>
              <select
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="form-select"
              >
                {['a1', 'a3'].map(option => (
                  <option key={option} value={option}>
                    Option {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plan Section */}
          <div className="form-section">
            <h2>Plan Section</h2>
            <div className="form-group">
              <label>Plan Style</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="form-select"
              >
                {['a1', 'a2', 'a3', 'a4'].map(option => (
                  <option key={option} value={option}>
                    Option {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Section */}
          <div className="form-section">
            <h2>Footer Options</h2>
            <div className="form-group">
              <label>Footer Style</label>
              <select
                name="footer"
                value={formData.footer}
                onChange={handleChange}
                className="form-select"
              >
                {['a1', 'a2', 'a3', 'a4', 'a5'].map(option => (
                  <option key={option} value={option}>
                    Option {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Police Section */}
          <div className="form-section">
            <h2>Police Section</h2>
            <div className="form-group">
              <label>Police Style</label>
              <select
                name="police"
                value={formData.police}
                onChange={handleChange}
                className="form-select"
              >
                <option value="a1">Option A1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? (
              <>
                <FiLoader className="spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditorPage;