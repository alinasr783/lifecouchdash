import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FiSave, FiLoader, FiCheckCircle, FiAlertCircle, FiPlus, FiTrash, FiSun, FiMoon } from 'react-icons/fi';
import './editor.css';

const sectionStructures = {
  header: {
    a1: ['logo', 'links'],
    a2: ['logo_main', 'logo_sub', 'links']
  },
  footer: {
    a1: ['coach_name', 'email', 'phone', 'address', 'social_links'],
    a2: ['site_name', 'tagline', 'quick_links', 'social_links'],
    a3: ['title', 'subtitle', 'cards'],
    a4: ['title', 'contact', 'social_links'],
    a5: ['coach_name', 'description', 'quick_links', 'contact', 'social_links', 'working_hours']
  },
  plan: {
    a1: ['title', 'packages'],
    a2: ['title', 'packages'],
    a3: ['a3'],
    a4: ['a4']
  },
  about: {
    a1: ['hero_title', 'hero_subtitle', 'mission_text', 'services'],
    a2: ['a3']
  },
  police: {
    a1: ['title', 'intro', 'list', 'note']
  },
  landing: {
    a1: ['title', 'subtitle', 'buttonText'],
    a2: ['titleHighlight', 'titleSub', 'subtitle', 'buttonText']
  }
};

const EditorPage = () => {
  const [selectedVariants, setSelectedVariants] = useState({
    about: 'a1',
    footer: 'a1',
    header: 'a1',
    landing: 'a1',
    plan: 'a1',
    police: 'a1'
  });

  const [sectionData, setSectionData] = useState({
    about: {},
    footer: {},
    header: {},
    landing: {},
    plan: {},
    police: {}
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // اكتشاف الوضع المفضل عند التحميل
    const checkDarkMode = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark-mode', prefersDark);
    };

    checkDarkMode();

    // الاستماع لتغيرات الوضع
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark-mode', e.matches);
    };
    mediaQuery.addListener(handler);

    const fetchData = async () => {
      try {
        const { data: homeData } = await supabase
          .from('home')
          .select('*')
          .eq('id', 1)
          .single();

        const variants = homeData || {
          about: 'a1',
          footer: 'a1',
          header: 'a1',
          landing: 'a1',
          plan: 'a1',
          police: 'a1'
        };

        const newData = {};
        for (const [section, variant] of Object.entries(variants)) {
          const { data } = await supabase
            .from(section)
            .select(variant)
            .eq('id', 1)
            .single();

          newData[section] = data?.[variant] || {};
        }

        setSelectedVariants(variants);
        setSectionData(newData);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => mediaQuery.removeListener(handler);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark-mode', newMode);

    // حفظ التفضيل في localStorage
    localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
  };

  const handleVariantChange = async (section, variant) => {
    try {
      const { data } = await supabase
        .from(section)
        .select(variant)
        .eq('id', 1)
        .single();

      setSectionData(prev => ({
        ...prev,
        [section]: data?.[variant] || {}
      }));

      setSelectedVariants(prev => ({
        ...prev,
        [section]: variant
      }));
    } catch (err) {
      setError(err.message || 'Error changing variant');
    }
  };

  const handleInputChange = (section, field, value) => {
    setSectionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, index, subField, value) => {
    const newArray = [...(sectionData[section][field] || [])];
    newArray[index] = {
      ...newArray[index],
      [subField]: value
    };

    setSectionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const handleArrayAdd = (section, field) => {
    const newArray = [...(sectionData[section][field] || [])];
    newArray.push({});

    setSectionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const handleArrayRemove = (section, field, index) => {
    const newArray = [...(sectionData[section][field] || [])];
    newArray.splice(index, 1);

    setSectionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Update home table
      await supabase
        .from('home')
        .update(selectedVariants)
        .eq('id', 1);

      // Update each section
      for (const [section, data] of Object.entries(sectionData)) {
        await supabase
          .from(section)
          .update({ [selectedVariants[section]]: data })
          .eq('id', 1);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const renderInputs = (section) => {
    const variant = selectedVariants[section];
    const structure = sectionStructures[section][variant];
    const data = sectionData[section] || {};

    return structure.map(field => {
      if (Array.isArray(data[field])) {
        return (
          <div key={field} className="form-group">
            <label>{String(field).replace(/_/g, ' ').toUpperCase()}</label>
            {data[field].map((item, index) => (
              <div key={index} className="array-group">
                {Object.keys(item || {}).map(subField => (
                  <div key={subField} className="array-item">
                    <label>{subField.replace(/_/g, ' ').toUpperCase()}</label>
                    <input
                      type="text"
                      value={item[subField] || ''}
                      onChange={(e) => handleArrayChange(section, field, index, subField, e.target.value)}
                      placeholder={`Enter ${subField.replace(/_/g, ' ')}`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayRemove(section, field, index)}
                  aria-label="Remove item"
                >
                  <FiTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd(section, field)}
            >
              <FiPlus /> Add {String(field).replace(/_/g, ' ').replace(/s$/, '')}
            </button>
          </div>
        );
      }

      return (
        <div key={field} className="form-group">
          <label>{String(field).replace(/_/g, ' ').toUpperCase()}</label>
          <input
            type="text"
            value={data[field] || ''}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
            placeholder={`Enter ${String(field).replace(/_/g, ' ')}`}
          />
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="editor-container loading">
        <FiLoader className="spin" />
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <h1>Content Editor</h1>

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

      <div className="form-grid">
        {Object.keys(selectedVariants).map(section => (
          <div key={section} className="form-section">
            <h2>{String(section).toUpperCase()} SECTION</h2>

            <div className="form-group">
              <label>Variant Selection</label>
              <select
                value={selectedVariants[section]}
                onChange={(e) => handleVariantChange(section, e.target.value)}
              >
                {Object.keys(sectionStructures[section]).map(variant => (
                  <option key={variant} value={variant}>
                    {String(variant).toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {renderInputs(section)}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <FiLoader className="spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave />
              Save All Changes
            </>
          )}
        </button>
      </div>

      <button 
        className="dark-mode-toggle"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
};

export default EditorPage;