# Artify Block

An AI-powered image editing block for Milo that allows users to upload images and apply various effects and AI-powered transformations. The block features a modern, clean design with an intuitive interface for seamless image editing.

## Features

- **Image Upload**: Upload images via file picker or drag-and-drop
- **Predefined Effects**: Apply 6 different predefined visual effects to images
- **AI-Powered Commands**: Use natural language to transform images with AI
- **Image Toggle**: Switch between original and modified versions
- **Download & Share**: Download or share the edited images
- **Responsive Design**: Works on desktop and mobile devices

## Usage

To use the Artify block in your Milo content, add it to your page using the block syntax:

```html
<div class="artify"></div>
```

The block will be automatically initialized by the Milo framework.

## Configuration

### Backend API

The block requires a backend API server running on the configured URL. Update the `API_URL` constant in `artify.js` to match your backend:

```javascript
const API_URL = 'http://your-backend-url:5000';
```

### Required API Endpoints

Your backend should implement the following endpoints:

1. **POST /upload** - Upload image files
   - Input: FormData with 'file' field
   - Output: `{ fileName: string }`

2. **POST /customEffect1-6** - Apply predefined effects
   - Input: `{ fileName: string }`
   - Output: `{ modifiedImageUrl: string }`

3. **POST /process-image** - AI-powered image processing
   - Input: `{ fileName: string, prompt: string }`
   - Output: `{ modifiedImageUrl: string }`

## File Structure

```
libs/blocks/artify/
├── artify.js          # Main Preact component and logic
├── artify.css         # Styles for the block
├── README.md          # This documentation
└── assets/            # Image assets
    ├── banner.png     # Landing page banner
    ├── logo.png       # Artify logo
    └── effects/       # Effect preview images
        ├── effect1.png
        ├── effect2.png
        ├── effect3.png
        ├── effect4.png
        ├── effect5.png
        └── effect6.png
```

## Component Architecture

The Artify block is built using Preact with htm template literals and follows this component structure:

- **ArtifyApp**: Main application component managing state
- **LandingPage**: File upload interface  
- **Editor**: Main editing interface containing:
  - **Header**: Clean top navigation with logo, title, and action buttons
  - **Sidebar**: Modern effect selection panel with upload/browse options
  - **MainContent**: Centered image display and integrated command interface
- **Effects**: 2x3 grid of predefined effect previews
- **Command Interface**: Embedded "Ask Artify" prompt section

## Design Features

### Modern UI Design
- **Card-based Layout**: Clean container with subtle shadows and rounded corners
- **Professional Header**: Logo, dynamic title, and intuitive action buttons
- **Organized Sidebar**: Clearly labeled sections with Upload/Browse functionality  
- **Centered Image Display**: Responsive image container with toggle functionality
- **Integrated Commands**: Bottom-positioned "Ask Artify" prompt interface

### Styling

All styles are contained in `artify.css` and use the `.artify` prefix to avoid conflicts. The design features:

- **Primary Color**: `#d946ef` (modern purple)
- **Clean Typography**: Adobe Clean font family
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Hover effects and transitions
- **Accessible Colors**: High contrast ratios for readability

### Effects

To add more predefined effects:

1. Add effect preview images to `assets/effects/`
2. Update the `effectImages` array in `artify.js`
3. Ensure your backend supports the new effect endpoints

### API Integration

The block is designed to work with any backend that implements the required API. You can:

- Change the API URL
- Modify request/response formats
- Add authentication headers
- Implement error handling

## Browser Support

- Modern browsers with ES6 module support
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

## Development

The block uses:
- **Preact** with htm for templating
- **CSS Grid/Flexbox** for layouts
- **Fetch API** for backend communication
- **File API** for image handling

To test the block locally, open `test-artify.html` in a web server environment.

## Notes

- The block requires a backend server to be running for full functionality
- Image uploads are handled entirely by the backend
- The block maintains responsive design principles
- All images are optimized for web display
- Error handling is implemented for network failures
