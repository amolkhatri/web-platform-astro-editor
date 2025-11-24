import { useState, useEffect } from 'react';
import './App.css';
import BlockList from './components/BlockList';
import BlockEditor from './components/BlockEditor';
import Preview from './components/Preview';
import { fetchPages, savePage, fetchComponentRegistry } from './utils/api';

function App() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [componentRegistry, setComponentRegistry] = useState([]);

  // Load pages and component registry on mount
  useEffect(() => {
    loadPages();
    loadComponentRegistry();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPages();
      setPages(data);
      if (data.length > 0) {
        setCurrentPage(data[0]);
      }
    } catch (err) {
      setError('Failed to load pages. Make sure the backend is running on port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComponentRegistry = async () => {
    try {
      const components = await fetchComponentRegistry();
      setComponentRegistry(components);
    } catch (err) {
      setError('Failed to load component registry. Make sure the viewer is running on port 4321.');
      console.error(err);
    }
  };

  const handlePageChange = (slug) => {
    const page = pages.find((p) => p.slug === slug);
    if (page) {
      setCurrentPage(page);
      setSelectedBlockIndex(null);
    }
  };

  const handleAddBlock = (newBlock) => {
    if (!currentPage) return;

    const updatedBlocks = [...currentPage.blocks, newBlock];
    setCurrentPage({
      ...currentPage,
      blocks: updatedBlocks,
    });
    setSelectedBlockIndex(updatedBlocks.length - 1);
  };

  const handleDeleteBlock = (index) => {
    if (!currentPage) return;

    const updatedBlocks = currentPage.blocks.filter((_, i) => i !== index);
    setCurrentPage({
      ...currentPage,
      blocks: updatedBlocks,
    });

    if (selectedBlockIndex === index) {
      setSelectedBlockIndex(null);
    } else if (selectedBlockIndex > index) {
      setSelectedBlockIndex(selectedBlockIndex - 1);
    }
  };

  const handleUpdateBlock = (updatedBlock) => {
    if (!currentPage || selectedBlockIndex === null) return;

    const updatedBlocks = [...currentPage.blocks];
    updatedBlocks[selectedBlockIndex] = updatedBlock;
    setCurrentPage({
      ...currentPage,
      blocks: updatedBlocks,
    });
  };

  const handleReorderBlocks = (fromIndex, toIndex) => {
    if (!currentPage) return;

    const updatedBlocks = [...currentPage.blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);

    setCurrentPage({
      ...currentPage,
      blocks: updatedBlocks,
    });

    // Update selected index if needed
    if (selectedBlockIndex === fromIndex) {
      setSelectedBlockIndex(toIndex);
    } else if (selectedBlockIndex > fromIndex && selectedBlockIndex <= toIndex) {
      setSelectedBlockIndex(selectedBlockIndex - 1);
    } else if (selectedBlockIndex < fromIndex && selectedBlockIndex >= toIndex) {
      setSelectedBlockIndex(selectedBlockIndex + 1);
    }
  };

  const handleSave = async () => {
    if (!currentPage) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await savePage(currentPage);

      // Update pages list
      const updatedPages = pages.map((p) =>
        p.slug === currentPage.slug ? currentPage : p
      );
      setPages(updatedPages);

      setSuccessMessage('Page saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save page. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleNewPage = () => {
    const slug = prompt('Enter page slug (e.g., "about", "contact"):');
    if (!slug) return;

    const title = prompt('Enter page title:') || slug;

    const newPage = {
      slug,
      title,
      blocks: [],
    };

    setPages([...pages, newPage]);
    setCurrentPage(newPage);
    setSelectedBlockIndex(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading pages...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Page Editor</h1>

        <div className="header-controls">
          {pages.length > 0 && currentPage && (
            <select
              className="page-selector"
              value={currentPage.slug}
              onChange={(e) => handlePageChange(e.target.value)}
            >
              {pages.map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.title || page.slug}
                </option>
              ))}
            </select>
          )}

          <button onClick={handleNewPage}>
            + New Page
          </button>
        </div>

        <div className="header-actions">
          <button onClick={loadPages} disabled={loading}>
            🔄 Refresh
          </button>
          <button
            className="primary"
            onClick={handleSave}
            disabled={saving || !currentPage}
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {!currentPage ? (
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-state-icon">📄</div>
          <h2>No Pages Found</h2>
          <p>Create a new page to get started</p>
          <button className="primary" onClick={handleNewPage}>
            + Create Page
          </button>
        </div>
      ) : (
        <main className="app-main">
          <BlockList
            blocks={currentPage.blocks}
            selectedIndex={selectedBlockIndex}
            onSelectBlock={setSelectedBlockIndex}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            onReorderBlocks={handleReorderBlocks}
            componentRegistry={componentRegistry}
          />

          <Preview blocks={currentPage.blocks} />

          <BlockEditor
            block={selectedBlockIndex !== null ? currentPage.blocks[selectedBlockIndex] : null}
            onUpdateBlock={handleUpdateBlock}
            componentRegistry={componentRegistry}
          />
        </main>
      )}
    </div>
  );
}

export default App;
