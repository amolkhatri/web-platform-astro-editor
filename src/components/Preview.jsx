import { useState, useEffect } from 'react';

const RENDER_API_URL = 'http://localhost:4321/api/render';

export default function Preview({ blocks }) {
    const [renderedBlocks, setRenderedBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function renderBlocks() {
            if (blocks.length === 0) {
                setRenderedBlocks([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const rendered = await Promise.all(
                    blocks.map(async (block, index) => {
                        try {
                            const response = await fetch(RENDER_API_URL, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    type: block.type,
                                    data: block.data,
                                }),
                            });

                            if (!response.ok) {
                                throw new Error(`Failed to render block: ${response.statusText}`);
                            }

                            const { html, css } = await response.json();
                            return { html, css, index };
                        } catch (err) {
                            console.error(`Error rendering block ${index}:`, err);
                            return {
                                html: `<div style="color: red; padding: 1rem; border: 1px solid red;">Error rendering block: ${err.message}</div>`,
                                css: '',
                                index,
                            };
                        }
                    })
                );

                setRenderedBlocks(rendered);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        renderBlocks();
    }, [blocks]);

    return (
        <div className="preview-panel panel">
            <div className="panel-header">
                <h2 className="panel-title">Preview</h2>
                <span className="text-muted text-small">
                    {loading ? 'Rendering...' : 'Live preview'}
                </span>
            </div>
            <div className="preview-content">
                {error && (
                    <div className="error-state" style={{ color: 'red', padding: '1rem' }}>
                        Error: {error}
                    </div>
                )}
                {blocks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👁️</div>
                        <p>Add blocks to see preview</p>
                    </div>
                ) : (
                    <>
                        {renderedBlocks.map((block) => (
                            <div key={block.index}>
                                <style>{block.css}</style>
                                <div dangerouslySetInnerHTML={{ __html: block.html }} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
