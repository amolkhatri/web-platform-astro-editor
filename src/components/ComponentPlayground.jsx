import { useState } from 'react';
import { saveCustomComponent } from '../utils/api';

function ComponentPlayground({ onClose, onComponentCreated }) {
    const [componentData, setComponentData] = useState({
        type: '',
        label: '',
        description: '',
        category: 'content',
        code: '',
        fields: '[]',
        defaultData: '{}'
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field, value) => {
        setComponentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // Validate required fields
        if (!componentData.type || !componentData.label || !componentData.code) {
            setError('Type, Label, and Code are required fields');
            return;
        }

        // Validate JSON fields
        let fields, defaultData;
        try {
            fields = JSON.parse(componentData.fields);
            defaultData = JSON.parse(componentData.defaultData);
        } catch (e) {
            setError('Fields and Default Data must be valid JSON');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await saveCustomComponent({
                type: componentData.type,
                label: componentData.label,
                description: componentData.description,
                category: componentData.category,
                code: componentData.code,
                fields,
                defaultData
            });

            setSuccess(true);
            setTimeout(() => {
                onComponentCreated?.();
                onClose?.();
            }, 1500);
        } catch (err) {
            setError('Failed to save component. Please try again.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="playground-overlay">
            <div className="playground-modal">
                <div className="playground-header">
                    <h2>🎨 Component Playground</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">Component saved successfully!</div>}

                <div className="playground-content">
                    <div className="form-section">
                        <h3>Component Metadata</h3>

                        <div className="form-group">
                            <label htmlFor="type">Component Type *</label>
                            <input
                                id="type"
                                type="text"
                                placeholder="e.g., CustomHero"
                                value={componentData.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                            />
                            <small>Unique identifier for this component (no spaces)</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="label">Display Label *</label>
                            <input
                                id="label"
                                type="text"
                                placeholder="e.g., Custom Hero"
                                value={componentData.label}
                                onChange={(e) => handleInputChange('label', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                id="description"
                                type="text"
                                placeholder="Brief description of the component"
                                value={componentData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                value={componentData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                <option value="content">Content</option>
                                <option value="layout">Layout</option>
                                <option value="dynamic">Dynamic</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Astro Component Code *</h3>
                        <textarea
                            className="code-editor"
                            placeholder="Enter your Astro component code here..."
                            value={componentData.code}
                            onChange={(e) => handleInputChange('code', e.target.value)}
                            rows={15}
                        />
                        <small>Write your complete Astro component code (including frontmatter, markup, and styles)</small>
                    </div>

                    <div className="form-section">
                        <h3>Component Schema</h3>

                        <div className="form-group">
                            <label htmlFor="fields">Fields (JSON)</label>
                            <textarea
                                id="fields"
                                className="json-editor"
                                placeholder='[{"name": "title", "type": "text", "label": "Title", "required": true}]'
                                value={componentData.fields}
                                onChange={(e) => handleInputChange('fields', e.target.value)}
                                rows={6}
                            />
                            <small>Define the editable fields for this component as JSON array</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="defaultData">Default Data (JSON)</label>
                            <textarea
                                id="defaultData"
                                className="json-editor"
                                placeholder='{"title": "Default Title"}'
                                value={componentData.defaultData}
                                onChange={(e) => handleInputChange('defaultData', e.target.value)}
                                rows={4}
                            />
                            <small>Default values for the component fields</small>
                        </div>
                    </div>
                </div>

                <div className="playground-footer">
                    <button onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button
                        className="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : '💾 Save Component'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ComponentPlayground;
