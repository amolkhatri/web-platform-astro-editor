import { useState, useEffect } from 'react';

export default function BlockList({ blocks, selectedIndex, onSelectBlock, onAddBlock, onDeleteBlock, onReorderBlocks, componentRegistry = [] }) {
    const [newBlockType, setNewBlockType] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Set default block type when registry loads
    useEffect(() => {
        if (componentRegistry.length > 0 && !newBlockType) {
            setNewBlockType(componentRegistry[0].type);
        }
    }, [componentRegistry]);

    const handleAddBlock = () => {
        const component = componentRegistry.find(c => c.type === newBlockType);
        if (!component) return;

        const newBlock = {
            type: newBlockType,
            data: component.defaultData,
        };
        onAddBlock(newBlock);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        onReorderBlocks(draggedIndex, dropIndex);
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getBlockPreview = (block) => {
        switch (block.type) {
            case 'HeroSection':
                return block.data.title || 'Untitled Hero';
            case 'FeaturesGrid':
                return `${block.data.items?.length || 0} features`;
            case 'NewsletterSignup':
                return block.data.ctaText || 'Newsletter';
            case 'Header':
                return 'Header';
            case 'Hero':
                return block.data.title || 'Hero';
            case 'VehicleGrid':
                return block.data.title || 'Vehicle Grid';
            case 'ContentSection':
                return block.data.title || 'Content Section';
            case 'Footer':
                return 'Footer';
            case 'DynamicRenderer':
                return 'Dynamic Content';
            default:
                return block.type;
        }
    };

    return (
        <div className="blocks-panel panel">
            <div className="panel-header">
                <h2 className="panel-title">Blocks</h2>
                <span className="text-muted text-small">{blocks.length} total</span>
            </div>

            <div className="block-list">
                {blocks.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                        <p className="text-muted text-small">No blocks yet. Add one below!</p>
                    </div>
                ) : (
                    blocks.map((block, index) => (
                        <div
                            key={index}
                            className={`block-item ${selectedIndex === index ? 'selected' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                            onClick={() => onSelectBlock(index)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
                            <div className="block-info">
                                <div className="block-type">{block.type}</div>
                                <div className="block-preview">{getBlockPreview(block)}</div>
                            </div>
                            <div className="block-actions">
                                <button
                                    className="small danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteBlock(index);
                                    }}
                                    title="Delete block"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="add-block-section">
                <label htmlFor="block-type-select">Add New Block</label>
                <div className="add-block-controls">
                    <select
                        id="block-type-select"
                        className="block-type-select"
                        value={newBlockType}
                        onChange={(e) => setNewBlockType(e.target.value)}
                    >
                        {componentRegistry.length === 0 ? (
                            <option value="">Loading components...</option>
                        ) : (
                            componentRegistry.map(comp => (
                                <option key={comp.type} value={comp.type}>
                                    {comp.icon ? `${comp.icon} ` : ''}{comp.label}
                                </option>
                            ))
                        )}
                    </select>
                    <button className="primary" onClick={handleAddBlock}>
                        + Add
                    </button>
                </div>
            </div>
        </div>
    );
}
