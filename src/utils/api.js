const API_BASE_URL = 'https://web-platform-astro-viewer.vercel.app/api';
const VIEWER_API_URL = 'https://web-platform-astro-viewer.vercel.app/api';

/**
 * Fetch component registry from the viewer
 */
export async function fetchComponentRegistry() {
    try {
        const response = await fetch(`${VIEWER_API_URL}/components`);
        if (!response.ok) {
            throw new Error('Failed to fetch component registry');
        }
        const data = await response.json();
        return data.components;
    } catch (error) {
        console.error('Error fetching component registry:', error);
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
 * Fetch a specific page by slug
 */
export async function fetchPage(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
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
