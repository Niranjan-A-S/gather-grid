# Discord Clone Project

This project is a Discord clone built using Next.js, PostgreSQL, and a variety of other technologies to create a real-time messaging application. The stack includes Next.js for the frontend, PostgreSQL for the database, and additional libraries for various functionalities.

## Features

- **Real-Time Messaging**: Utilizes Socket.io for real-time messaging between clients and servers.
- **Attachments as Messages**: Allows users to send attachments as part of their messages using UploadThing.
- **Real-Time Edit and Delete**: Enables users to edit and delete messages in real-time.
- **Diverse Call Channels**: Supports text, audio, and video call channels, along with 1:1 conversations and video calls.
- **Efficient Member Management**: Offers functionalities for member management, including kicking and role changes.
- **Innovative Invite System**: Features a functional invite system with unique invite link generation.
- **Effortless Infinite Loading**: Implements message loading in batches using tanstack/query.
- **Personalized Server Creation**: Allows users to create and customize their own servers.
- **Stunning UI with TailwindCSS**: Uses TailwindCSS for crafting a beautiful and responsive UI.
- **Responsive Design and Modes**: Ensures a responsive design with light and dark modes.
- **Websocket Fallback with Polling**: Implements a websocket fallback using polling with alerts.
- **ORM with Prisma**: Utilizes Prisma for database interactions, offering a powerful ORM solution.
- **Secured Authentication via Clerk**: Implements secure user authentication using Clerk.

## Stack

- **Frontend**: Next.js, TailwindCSS for styling.
- **Backend**: PostgreSQL database managed with Prisma ORM.
- **Real-Time Communication**: Socket.io for real-time messaging and LiveKit for audio/video calls.
- **Authentication**: Clerk for secure user authentication.
- **UI Components**: Radix UI for various UI components and controls.
- **State Management**: Zustand for state management.
- **Validation**: Zod for schema validation.

## Getting Started

1. **Clone the Repository**: Start by cloning this repository to your local machine.
2. **Install Dependencies**: Run `npm install` or `yarn install` to install all necessary dependencies.
3. **Setup PostgreSQL**: Ensure you have PostgreSQL running locally or set up a remote database. Update the `.env` file with your database connection details.
4. **Run the Development Server**: Use `npm run dev` or `yarn dev` to start the development server.
