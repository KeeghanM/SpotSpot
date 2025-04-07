# SpotSpot

SpotSpot is a web application that helps you track, organize, and rate your favorite places. Create lists of spots you want to visit and track the ones you've already been to. Like Letterboxd but for places to go and things to do!

## Features

- **Create Lists**: Organize your spots in different categories or lists (restaurants, parks, attractions, etc.)
- **Track Spots**: Add places you want to visit with location data from Google Maps
- **Rating System**: Rate and review places you've visited
- **Tagging System**: Add custom tags to your spots for better organization and filtering
- **Filtering Options**: Filter spots by tags or visited status
- **User Authentication**: Secure authentication system for personalized experience

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: TailwindCSS 4
- **Backend**: Astro with Node.js
- **Database**: Turso (SQLite-based)
- **Authentication**: Better Auth
- **ORM**: Drizzle
- **API Integration**: Google Maps Places API
- **State Management**: Zustand, TanStack Query

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- A Turso database account and authentication token
- Google Maps API key with Places API enabled

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/spotspot.git
   cd spotspot
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up the database

   ```bash
   npx drizzle-kit push
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:4321`

## Project Structure

- `/src` - Source files
  - `/components` - React components
    - `/app` - Application-specific components
      - `/stores` - Zustand stores
      - `/hooks` - Custom React hooks
      - `/viewer` - Components for viewing lists and spots
  - `/lib` - Utility functions and libraries
    - `/db` - Database configuration and schema
    - `/auth` - Authentication setup
  - `/pages` - Astro pages
    - `/api` - API endpoints

## Usage

### Creating a List

1. Click the "New List" button in the controls section
2. Enter a name for your list
3. Click "Create List"

### Adding a Spot

1. Select a list from the viewer
2. Click the "New Spot" button
3. Enter the spot name and click "Create Spot"
4. Click on the newly created spot to edit its details:
   - Add location information using Google Maps integration
   - Add notes, tags, and a rating if you've visited

### Managing Spots

- Mark spots as visited by checking the visited checkbox
- Rate visited spots using the 5-star rating system
- Add tags to spots for better organization
- Filter spots by tags or visit status using the filters panel

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Astro](https://astro.build/) - The web framework
- [React](https://reactjs.org/) - The UI library
- [TailwindCSS](https://tailwindcss.com/) - For styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching
- [Drizzle ORM](https://orm.drizzle.team/) - ORM for Turso database
- [Turso](https://turso.tech/) - SQLite database in the cloud
- [Better Auth](https://github.com/better-auth/better-auth) - Authentication library
- [Google Maps API](https://developers.google.com/maps) - For location functionality
