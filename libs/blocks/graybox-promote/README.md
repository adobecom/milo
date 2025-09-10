# Graybox Promote Block

A comprehensive tool for managing content promotion workflows in Adobe's Graybox environment. This block provides a user-friendly interface for bulk copying content and promoting experiences from development to production environments.

## Overview

The Graybox Promote block is a Lit-based web component that enables content managers and developers to:

- **Bulk Copy**: Copy multiple URLs and their associated content to SharePoint
- **Promote**: Promote experiences from graybox environments to production
- **Monitor**: Track the status of bulk copy and promotion operations in real-time
- **Manage**: Handle fragments, configurations, and project settings

## Features

### Bulk Copy Tab
- **Multi-URL Input**: Add multiple URLs for bulk copying with paste support
- **Fragment Inclusion**: Toggle to include or exclude fragments during copy
- **Experience Naming**: Set custom experience names for organized content management
- **Real-time Status**: Live monitoring of bulk copy progress with detailed step information
- **Validation**: URL validation ensuring all URLs are from the same domain

### Promote Tab
- **Configuration Summary**: Display current project configuration and settings
- **Status Monitoring**: Real-time tracking of promotion status with visual indicators
- **Step-by-step Progress**: Detailed view of each promotion step with expandable details
- **Error Handling**: Comprehensive error reporting and user feedback

## Architecture

### Core Components

- **`graybox-promote-lit.js`**: Main Lit component handling the UI and business logic
- **`services.js`**: API service layer for SharePoint and Graybox integrations
- **`bulk-tab.js`**: Bulk copy functionality and UI rendering
- **`promote-tab.js`**: Promotion functionality and status display
- **`ui-components.js`**: Reusable UI components and utilities
- **`constants.js`**: Configuration constants and status mappings

### Key Dependencies

- **Lit**: Web component framework for reactive UI
- **SharePoint Integration**: Authentication and file management
- **Adobe I/O Runtime**: Backend services for bulk operations
- **Milo Utils**: Shared utilities for configuration and styling

## Usage

### Basic Setup

1. Include the block in your page:
```html
<div class="graybox-promote"></div>
```

2. The component will automatically initialize and load configuration from:
   - URL parameters (`ref`, `repo`, `owner`, `referrer`)
   - Graybox configuration files
   - SharePoint settings

### Configuration Requirements

The block requires the following configuration in your graybox config:

```json
{
  "graybox": {
    "data": [
      {
        "key": "sharepoint.site.enablePromote",
        "value": "true"
      },
      {
        "key": "prod.graybox.base.url",
        "value": "https://your-graybox-service.com"
      },
      {
        "key": "prod.graybox.promote.url", 
        "value": "https://your-promote-service.com"
      }
    ]
  }
}
```

### URL Parameters

The component accepts these URL parameters:
- `ref`: Git reference (branch/tag)
- `repo`: Repository name
- `owner`: Repository owner
- `referrer`: Referrer URL for context

## API Integration

### Bulk Copy API

**Endpoint**: `{baseUrl}/bulk-copy`

**Parameters**:
- `sourcePaths`: Comma-separated list of URLs
- `adminPageUri`: Admin page URI for context
- `driveId`: SharePoint drive ID
- `gbRootFolder`: Graybox root folder path
- `rootFolder`: Production root folder path
- `experienceName`: Name for the experience
- `projectExcelPath`: Path to project Excel file
- `spToken`: SharePoint authentication token
- `includeFragments`: Boolean flag for fragment inclusion

### Promotion API

**Endpoint**: `{baseUrl}/promote.json`

**Method**: POST

**Body**: Form-encoded data including setup configuration

### Status Monitoring

**Bulk Copy Status**: `{baseUrl}/file-status.json?showContent=graybox_promote/{repo}/{experienceName}/bulk-copy-status.json`

**Promotion Status**: `{baseUrl}/file-status.json?showContent=graybox_promote/{repo}/{experienceName}/status.json`

## Status Flow

### Bulk Copy Statuses
- `initiated`: Process started
- `in_progress`: Currently processing
- `completed`: Successfully finished
- `failed`: Process failed

### Promotion Statuses
- `initiated`: Promotion started
- `initial_preview_in_progress`: Initial preview being generated
- `initial_preview_done`: Initial preview completed
- `process_content_in_progress`: Content being processed
- `processed`: Content processing completed
- `promoted`: Successfully promoted
- `final_preview_in_progress`: Final preview being generated
- `final_preview_done`: Final preview completed
- `paused`: Process paused

## Authentication

The component integrates with Microsoft SharePoint authentication using MSAL (Microsoft Authentication Library). Users must be authenticated with appropriate permissions:

- `files.readwrite`: For file operations
- `sites.readwrite.all`: For site-level operations

## Error Handling

The component includes comprehensive error handling:

- **Validation Errors**: Client-side validation for URLs and required fields
- **API Errors**: Network and server error handling with user-friendly messages
- **Authentication Errors**: Automatic retry and re-authentication flows
- **Status Errors**: Graceful handling of status polling failures

## Styling

The component uses CSS custom properties for theming and includes:

- Responsive design for different screen sizes
- Dark/light theme support
- Accessible color contrasts
- Smooth animations and transitions

## Development

### Local Development

1. Ensure you have the required dependencies installed
2. Set up your local environment with proper SharePoint credentials
3. Configure your graybox environment settings
4. Run the component in a development server

### Testing

The component includes comprehensive error handling and validation. Test scenarios should cover:

- URL validation and bulk operations
- Authentication flows
- Status polling and updates
- Error conditions and recovery

## Browser Support

- Modern browsers with ES6+ support
- Web Components v1 support
- Fetch API support
- CSS Custom Properties support

## Security Considerations

- All API calls use HTTPS
- Authentication tokens are handled securely
- Input validation prevents XSS attacks
- SharePoint permissions are properly scoped

## Troubleshooting

### Common Issues

1. **Authentication Failures**: Ensure proper SharePoint permissions and valid tokens
2. **Configuration Errors**: Verify graybox config includes required settings
3. **URL Validation**: Ensure all URLs are from the same domain
4. **Status Polling**: Check network connectivity and API endpoint availability

### Debug Mode

Enable debug logging by setting `localStorage.debug = 'graybox-promote'` in browser console.

## Contributing

When contributing to this block:

1. Follow the existing code style and patterns
2. Add appropriate error handling
3. Include comprehensive tests
4. Update documentation for new features
5. Ensure accessibility compliance

## License

This component is part of the Adobe Milo project and follows the project's licensing terms.
