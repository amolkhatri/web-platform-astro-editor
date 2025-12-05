// Determine API base URL based on environment
const getApiBaseUrl = () => {
    const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '');
    return isLocalhost
        ? 'http://localhost:4321/api'
        : 'https://web-platform-astro-viewer.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();
const VIEWER_API_URL = getApiBaseUrl();

/**
 * Fetch component registry from the viewer
 */
export async function fetchComponentRegistry() {
    try {
        const response = await fetch(`${VIEWER_API_URL}/components.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch component registry');
        }
        const data = await response.json();
        return data; // API returns array directly, not { components: [...] }
    } catch (error) {
        console.error('Error fetching component registry:', error);
        throw error;
    }
}

/**
 * Fetch available layouts from the viewer
 */
export async function fetchLayouts() {
    try {
        const response = await fetch(`${VIEWER_API_URL}/layouts.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch layouts');
        }
        const data = await response.json();
        return data.layouts;
    } catch (error) {
        console.error('Error fetching layouts:', error);
        throw error;
    }
}

/**
 * Fetch all pages from the backend
 */
export async function fetchPages() {
    try {
        const response = await fetch(`${API_BASE_URL}/pages`);
        if (!response.ok) {
            throw new Error('Failed to fetch pages');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }
}

/**
 * Fetch a specific page by slug.
 * When used by the editor, we prefer the draft version if it exists.
 */
export async function fetchPage(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${slug}?draft=true`);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${slug}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching page ${slug}:`, error);
        throw error;
    }
}

/**
 * Save or update a page
 */
export async function savePage(pageData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pageData),
        });

        if (!response.ok) {
            throw new Error('Failed to save page');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving page:', error);
        throw error;
    }
}

/**
 * Save or update a draft page.
 * This is used for autosaving editor changes to a draft version.
 */
export async function saveDraftPage(pageData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/draft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pageData),
        });

        if (!response.ok) {
            throw new Error('Failed to save draft page');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving draft page:', error);
        throw error;
    }
}

/**
 * Publish a draft page to live.
 */
export async function publishPage(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug }),
        });

        if (!response.ok) {
            throw new Error('Failed to publish page');
        }

        return await response.json();
    } catch (error) {
        console.error('Error publishing page:', error);
        throw error;
    }
}

/**
 * Fetch all custom components from the viewer
 */
export async function fetchCustomComponents() {
    try {
        const response = await fetch(`${VIEWER_API_URL}/custom-components`);
        if (!response.ok) {
            throw new Error('Failed to fetch custom components');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching custom components:', error);
        throw error;
    }
}

/**
 * Save a custom component to the viewer
 */
export async function saveCustomComponent(componentData) {
    try {
        const response = await fetch(`${VIEWER_API_URL}/custom-components`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(componentData),
        });

        if (!response.ok) {
            throw new Error('Failed to save custom component');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving custom component:', error);
        throw error;
    }
}


