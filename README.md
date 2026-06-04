# Seahorse Saga

## Overview

Seahorse Saga is now a database-driven game experience built with Next.js and MongoDB. Player profiles, progression, leaderboards, missions, and reward systems are stored in a MongoDB database rather than on-chain. Players enter a username to onboard, earn XP through missions, claim daily rewards, and unlock items from an in-game marketplace.

This project now focuses on backend persistence using MongoDB and frontend gameplay flow without Solana, wallet connections, Honeycomb, or blockchain payments.

## Features

- **Database-powered Player Profiles and Progression**: Player data such as username, level, XP, badges, inventory, gold, and gems is stored in MongoDB.
- **Mission System**: Quests unlock based on XP and prior completions, with a gameplay flow that rewards XP and progression.
- **Resource Management**: XP, gold, and gems are tracked in the database and updated through gameplay and rewards.
- **In-game Marketplace**: Players can purchase items from the marketplace and add them to their inventory without blockchain payments.
- **Daily Rewards**: A daily claim endpoint awards in-game gold and gems.
- **Leaderboard and Rankings**: Displays player standings based on database profile XP.
- **Frontend Pages**: Onboarding, Mission Hub, Quest, NFT Marketplace, and Rankings.

## Technologies Used

- **Next.js**: For the frontend application and API routes.
- **MongoDB + Mongoose**: For data persistence, player profiles, and game progression.
- **React Hot Toast**: For user notifications.
- **Framer Motion**: For animated UI interactions.

## Installation

To set up the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/clemzyumoh/SeaHorse.git
   cd seahorse-saga
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in a `.env` file:

MONGO_URI: MongoDB connection string.

If you deploy the application, optionally set any necessary Next.js runtime environment variables for your deployment target.

4. Run the development server:
   ```
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Usage

## API Endpoints

The application exposes the following API endpoints for backend operations (all under `/api/` prefix).

- `/api/fund` (POST): Claims daily in-game rewards (gold and gems) for a player.
- `/api/leaderboard` (GET): Retrieves leaderboard data from MongoDB profiles.
- `/api/setup/checkProfile` (GET): Checks if a player has an existing profile by username.
- `/api/setup/createProfile` (POST): Creates a new player profile in MongoDB.
- `/api/setup/updateProfile` (POST): Updates an existing profile with XP, badges, items, and rewards.

## Player Flow

1. **Onboarding Page**: Players enter a username and begin the game. The application checks for an existing profile and creates one if needed.

2. **Mission Hub Page**: Players claim daily rewards and select missions. Missions unlock based on accumulated XP and completion of prior missions.

3. **Quest Page**: Players engage in gameplay to earn XP. On completion, the profile updates with XP and badges.

4. **NFT Page**: Players unlock in-game items based on level and purchase them from the marketplace without blockchain payments.

5. **Rankings Page**: Displays leaderboard standings derived from database player profiles.

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request with clear descriptions of changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
