# Page Editor - Quick Start Guide

## 🚀 Starting the Editor

### 1. Start the Backend Server
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:3001`

### 2. Start the Editor
```bash
cd editor
npm run dev
```
The editor will open on `http://localhost:5173`

### 3. Start the Viewer (Optional)
```bash
cd viewer
npm run dev
```
The viewer will run on `http://localhost:4321`

## 📝 Quick Actions

### Create a New Page
1. Click **"+ New Page"** in the header
2. Enter slug (e.g., "about")
3. Enter title (e.g., "About Us")

### Add a Block
1. Select block type from dropdown in Blocks panel
2. Click **"+ Add"**
3. Block is added and selected automatically

### Edit a Block
1. Click on block in Blocks panel to select it
2. Edit properties in the Editor panel
3. See live preview in Preview panel

### Reorder Blocks
1. Drag the **⋮⋮** handle on any block
2. Drop at desired position

### Delete a Block
1. Click the **🗑️** button on the block

### Save Changes
1. Click **"💾 Save"** in the header
2. Wait for success message

## 🎨 Block Types

### HeroSection
- **Title**: Main heading
- **Subtitle**: Supporting text

### FeaturesGrid
- **Items**: List of features
- Use **+ Add Feature** to add items
- Use **✕** to remove items

### NewsletterSignup
- **CTA Text**: Button text

## 🔧 Keyboard Shortcuts

- **Cmd/Ctrl + S**: Save (coming soon)
- **Cmd/Ctrl + Z**: Undo (coming soon)

## 📂 File Structure

```
astro-websites-platform/
├── backend/          # Express API server
│   ├── server.js
│   └── db.json      # Page data storage
├── editor/          # React editor app
│   └── src/
│       ├── components/
│       ├── utils/
│       └── App.jsx
└── viewer/          # Astro viewer app
    └── src/
        ├── components/
        └── pages/
```

## 🐛 Troubleshooting

### "Failed to load pages"
- Make sure backend is running on port 3001
- Check `backend/server.js` is running

### "Failed to save page"
- Verify backend is accessible
- Check browser console for errors

### Editor not loading
- Make sure you ran `npm install` in the editor directory
- Try clearing browser cache

## 🎯 Next Steps

1. **Add more block types**: Create new block components
2. **Customize styling**: Edit `index.css` and `App.css`
3. **Add features**: Implement undo/redo, templates, etc.
4. **Deploy**: Build and deploy to production

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Astro Documentation](https://astro.build)
