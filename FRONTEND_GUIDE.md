# 🌐 LinkSnip Frontend - User Guide

## Overview

A beautiful, modern web frontend for your URL shortener with a responsive design that works on desktop, tablet, and mobile.

## Features

✨ **Modern UI/UX**
- Clean, professional design
- Gradient animations
- Smooth transitions and hover effects
- Responsive on all devices

🚀 **Fast & Efficient**
- Real-time validation
- Instant feedback
- Loading states
- Error handling

📊 **Full Functionality**
- Shorten URLs instantly
- View URL statistics
- Custom aliases support
- Expiration date support
- Copy to clipboard with one click

🎨 **Beautiful Design**
- Dark/light optimized
- Mobile-first responsive
- Accessibility-friendly
- Professional color scheme

## Getting Started

### 1. **Start the Server**
```bash
npm start
```

### 2. **Open in Browser**
```
http://localhost:3000
```

That's it! 🎉

## Usage

### Creating a Short URL

1. **Enter Long URL** - Paste your long URL in the "Long URL" field
2. **Optional: Add Custom Alias** - Create a custom short code (e.g., "mylink")
3. **Optional: Set Expiration** - Choose when the URL should expire
4. **Click "Shorten URL"** - Your link will be created instantly

### Result Screen

After shortening:
- 📋 **Copy Short Code** - Click the clipboard icon to copy the short code
- 📋 **Copy Short URL** - Click the clipboard icon to copy the full short URL
- 📊 **View Stats** - Click to see how many people clicked your link
- ➕ **Create Another** - Shorten another URL

### Viewing Statistics

1. Click **"View Stats"** on the result screen
2. See:
   - Total clicks
   - Creation date
   - Expiration date
   - When stats were last refreshed
3. Click **"Refresh Stats"** to get the latest numbers

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` (or `Cmd+L` on Mac) | Focus on URL input field |
| `Escape` | Close statistics panel |

## Design Features

### Responsive Layout
- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Mobile (< 768px)

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Background**: Light gray (#f9fafb)

### Animations
- Fade-in on page load
- Slide-in for alerts
- Pulse animation on logo
- Smooth transitions on all interactive elements

## File Structure

```
public/
├── index.html      # Main HTML structure
├── style.css       # All styling (responsive)
└── script.js       # Frontend logic (API calls)
```

## Frontend Components

### 1. **Header**
- Logo with animated icon
- Tagline

### 2. **Shortener Form**
- URL input with validation
- Custom alias input (optional)
- Expiration date picker (optional)
- Submit button with loading state

### 3. **Result Display**
- Short code display
- Short URL display
- Original URL display
- Creation timestamp
- Action buttons (copy, view stats, create another)

### 4. **Statistics Panel**
- Short code
- Total clicks counter
- Dates (created, expires)
- Last refreshed timestamp
- Refresh button

### 5. **Footer**
- Links to API docs, About, Contact

### 6. **Modals**
- API documentation modal
- About application modal

## API Integration

The frontend uses the API via:

```javascript
// Configuration
const API_BASE = '/api/v1';
const API_KEY = 'key1';

// Endpoints used:
POST /api/v1/shorten         // Create short URL
GET  /api/v1/stats/{code}    // Get statistics
GET  /{shortCode}            // Redirect (no auth)
```

## Error Handling

The frontend handles:
- ✅ Network errors
- ✅ Invalid URLs
- ✅ API failures
- ✅ Missing required fields
- ✅ Rate limiting (429 errors)

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Good color contrast ratios
- ✅ Focus states on interactive elements

## Performance Optimizations

- Minimal CSS and JavaScript
- No external dependencies
- Single-page application (SPA)
- Efficient DOM updates
- Asset caching via browser

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Customization

### Change API Key
Edit `public/script.js`:
```javascript
const API_KEY = 'your-api-key';
```

### Change Primary Color
Edit `public/style.css`:
```css
--primary-color: #your-color;
```

### Change App Name
Edit `public/index.html`:
- Change "LinkSnip" text
- Change logo icon emoji
- Update page title

## Mobile Experience

The frontend is fully responsive:
- Touch-friendly buttons
- Large input fields
- Optimized layouts
- Prevents zoom on input focus
- Full-width sections

## Development

### Testing the Frontend

1. **Start server**: `npm start`
2. **Open browser**: `http://localhost:3000`
3. **Test shortening**:
   - Valid URL: `https://www.google.com`
   - Custom alias: `test`
   - Expiration: Set future date

4. **Test error handling**:
   - Invalid URL: `not-a-url`
   - Existing alias: Use one you already created

### Debugging

Open browser console (F12) to see:
- API calls
- Errors
- Logs
- Network requests

```javascript
// Console shows:
// 🔗 LinkSnip Frontend Loaded
// 📝 API Base: /api/v1
// 🔑 Using API Key: key1
```

## Frontend Best Practices

✅ **Security**
- No credentials stored in frontend
- API key rotation in .env
- Input validation on client
- HTTPS in production

✅ **Performance**
- CSS-only animations
- No unnecessary API calls
- Efficient form validation
- Caching of recent URLs

✅ **UX**
- Loading states
- Error messages
- Success confirmations
- Keyboard shortcuts

## Troubleshooting

### "Cannot connect to server"
- Make sure server is running: `npm start`
- Check port 3000 is available
- Verify BASE_URL in script.js

### "Invalid API key"
- Check API_KEY in script.js
- Verify API_KEYS in .env
- Default key is `key1`

### "URL field shows error"
- URL must start with http:// or https://
- Try: `https://www.example.com`

### "Copy button doesn't work"
- Check browser supports Clipboard API
- Fallback copies using execCommand
- Manual copy: Select text and Ctrl+C

## Future Enhancements

Potential features to add:
- QR code generation
- URL list/history
- Dark mode toggle
- Custom themes
- Batch URL shortening
- Download statistics as CSV
- Social media sharing

## Support

For issues or suggestions, check:
- `README.md` - General documentation
- `FEATURES.md` - Feature breakdown
- `QUICKSTART.md` - Testing guide
- Server logs: `logs/combined.log`

**Contact:** obodaisteve@gmail.com (Ghana)

---

**Enjoy using LinkSnip!** 🚀

Made with ❤️ for beautiful, functional web apps.
