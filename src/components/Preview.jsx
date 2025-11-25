import { useState, useEffect, useMemo } from 'react';

// Determine API base URL based on environment
const getRenderApiUrl = () => {
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname === '');
  return isLocalhost 
    ? 'http://localhost:4321/api/render'
    : 'https://web-platform-astro-viewer.vercel.app/api/render';
};

const RENDER_API_URL = getRenderApiUrl();

const BASE_LAYOUT_STYLES = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    --md-ref-palette-primary40: #94b2ff;
    --md-ref-palette-primary80: #d6e2ff;
    --md-ref-palette-secondary40: #b9c6da;
    --md-ref-palette-secondary80: #dde2f3;
    --md-ref-palette-tertiary40: #f3b2d8;
    --md-ref-palette-tertiary80: #ffd7f0;
    --md-ref-palette-neutral10: #121212;
    --md-ref-palette-neutral20: #1c1c1c;
    --md-ref-palette-neutral30: #262626;
    --md-ref-palette-neutral90: #e2e2e2;
    --md-ref-palette-error40: #f2b8b5;

    --md-sys-color-background: var(--md-ref-palette-neutral10);
    --md-sys-color-on-background: var(--md-ref-palette-neutral90);
    --md-sys-color-surface: #121212;
    --md-sys-color-surface-container: #1c1c1c;
    --md-sys-color-surface-container-high: #222222;
    --md-sys-color-surface-container-highest: #2f2f2f;
    --md-sys-color-on-surface: var(--md-ref-palette-neutral90);
    --md-sys-color-outline: rgba(255, 255, 255, 0.12);
    --md-sys-color-primary: var(--md-ref-palette-primary40);
    --md-sys-color-primary-container: #1d3456;
    --md-sys-color-on-primary: #0a2d61;
    --md-sys-color-tertiary: var(--md-ref-palette-tertiary40);
    --md-sys-color-error: #f2b8b5;

    --page-bg: var(--md-sys-color-background);
    --surface-bg: var(--md-sys-color-surface);
    --card-bg: var(--md-sys-color-surface-container);
    --card-bg-muted: #191919;
    --card-bg-contrast: var(--md-sys-color-surface-container-highest);
    --border-color: var(--md-sys-color-outline);
    --text-color: var(--md-sys-color-on-surface);
    --heading-color: var(--md-sys-color-on-surface);
    --text-muted: color-mix(in srgb, var(--md-sys-color-on-surface) 65%, transparent);
    --primary-color: var(--md-sys-color-primary);
    --primary-color-strong: var(--md-sys-color-primary-container);
    --primary-color-soft: color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent);
    --accent-color: var(--md-sys-color-tertiary);
    --danger-color: var(--md-sys-color-error);
    --danger-color-dark: #b01c1c;
    --shadow-soft: 0 8px 18px rgba(0, 0, 0, 0.55);
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 24px;
  }

  body {
    margin: 0;
    font-family: "Inter", "Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--page-bg);
    color: var(--text-color);
    min-height: 100vh;
    padding: 0;
  }

  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--surface-bg);
  }
`;

const buildPreviewDocument = (blocks) => {
  const blockHtml = blocks.map((block) => block.html).join('\n');
  const blockCss = blocks.map((block) => block.css || '').join('\n');

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      ${BASE_LAYOUT_STYLES}
      ${blockCss}
    </style>
  </head>
  <body>
    <main>
      ${blockHtml}
    </main>
  </body>
</html>
  `;
};

export default function Preview({ blocks }) {
    const [renderedBlocks, setRenderedBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const previewDocument = useMemo(() => {
      if (!renderedBlocks.length) {
        return '';
      }
      return buildPreviewDocument(renderedBlocks);
    }, [renderedBlocks]);

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
                    <iframe
                        title="Page preview"
                        className="preview-iframe"
                        srcDoc={previewDocument}
                    />
                )}
            </div>
        </div>
    );
}
