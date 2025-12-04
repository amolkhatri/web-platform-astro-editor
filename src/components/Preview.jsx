import { useState, useEffect, useMemo } from 'react';

const getViewerBaseUrl = () => {
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '');

  return isLocalhost
    ? 'http://localhost:4321'
    : 'https://web-platform-astro-viewer.vercel.app';
};

const VIEWER_BASE_URL = getViewerBaseUrl();

export default function Preview({ blocks, pageSlug, layout }) {
  const [reloadKey, setReloadKey] = useState(0);

  const normalizedSlug = useMemo(() => {
    if (!pageSlug) return 'home';
    return pageSlug.replace(/^\/+/, '') || 'home';
  }, [pageSlug]);

  // Editor preview should use the draft version of the page
  const draftPreviewUrl = `${VIEWER_BASE_URL}/${normalizedSlug}?draft=true`;
  const livePreviewUrl = `${VIEWER_BASE_URL}/${normalizedSlug}`;

  // Whenever blocks or layout change, bump the reload key so the iframe reloads the draft URL
  useEffect(() => {
    if (blocks && blocks.length >= 0) {
      setReloadKey((key) => key + 1);
    }
  }, [blocks, layout]);

  return (
    <div className="preview-panel panel">
      <div className="panel-header">
        <h2 className="panel-title">Preview</h2>
        <span className="text-muted text-small">
          Draft preview (from ?draft=true)
        </span>
        <button
          className="small secondary"
          onClick={() => window.open(livePreviewUrl, '_blank', 'noopener,noreferrer')}
        >
          Open live page ↗
        </button>
      </div>
      <div className="preview-content">
        {blocks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👁️</div>
            <p>Add blocks to see preview</p>
          </div>
        ) : (
          <iframe
            key={reloadKey}
            title="Page preview"
            className="preview-iframe"
            src={draftPreviewUrl}
          />
        )}
      </div>
    </div>
  );
}
