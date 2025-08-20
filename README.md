# Seahorse Saga

## Overview

Seahorse Saga is an on-chain game built on the Solana blockchain, leveraging the Honeycomb Protocol to manage verifiable player progression, missions, and traits. The game emphasizes permanent, portable player data stored on-chain, enabling mechanics such as mission-based quests, character assembly, resource management (e.g., XP as game currency), and NFT integrations. Players engage in underwater-themed missions to defeat mechanical fishes, earn XP, unlock badges, and purchase NFTs that enhance their progression. All core player details, including profiles, levels, badges, and NFT addresses, are stored on-chain for transparency and composability across dApps.

This project serves as a demonstration of Honeycomb Protocol's capabilities in powering on-chain game mechanics, including missions, trait evolution, and progression systems. It includes a playable MVP with frontend interactions, backend API endpoints for minting and funding, and Solana Pay for transactions.

## Features

- **On-Chain Player Profiles and Progression**: Player data (username, wallet address, level, badges, NFT addresses) stored via Honeycomb Profiles, enabling a dynamic leaderboard.
- **Mission System**: Quests unlocked based on XP and prior completions, with time-based challenges (e.g., earn 500 XP in 150 seconds by defeating enemies).
- **Character Assembly**: Players create and assemble characters to deploy on missions.
- **Resource Management**: XP as an on-chain resource earned through missions and NFT purchases.
- **NFT Minting and Purchases**: NFTs unlocked by player level, purchasable via Solana Pay using daily-claimed SOL and USDC. Minted using Metaplex.
- **Daily Claims**: Faucet-like endpoint for claiming SOL and USDC to facilitate testing and gameplay.
- **Leaderboard and Rankings**: Real-time display of player standings based on on-chain data.
- **Frontend Pages**: Onboarding, Mission Hub, Quest (gameplay), NFT Marketplace, and Rankings.

## Technologies Used

- **Honeycomb Protocol**: For projects, users/profiles, characters, resources (XP), missions, and mission pools.
- **Metaplex**: For NFT minting and metadata management.
- **Solana Pay**: For secure, on-chain payments when purchasing NFTs.
- **Solana Web3.js and SPL-Token**: For blockchain interactions, token minting, and transfers.
- **Next.js**: For the frontend application and API routes.
- **Umi (Metaplex SDK)**: For simplified NFT creation.
- **React Hot Toast**: For user notifications during transactions.

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
 RPC_URL: Solana RPC endpoint (e.g., devnet).

WALLET_SECRET_KEY: Secret key for the admin wallet (JSON array format).

ADMIN_SECRET_KEY: Base58-encoded secret key for funding operations.

ADMIN_PRIVATE_KEY: Base58-encoded private key for Honeycomb transactions.

MONGO_URI: MongoDB connection string.

NEXT_PUBLIC_BASE_URL: Base URL of the deployed app (e.g., Vercel).

NEXT_PUBLIC_NFT_RECEIVING_WALLET: Wallet address to receive minted NFTs.

USDC_MINT_ADDRESS: Public key of the USDC mint (devnet).

HONEYCOMB_RESOURCE_ADDRESS: Honeycomb resource address.

HONEYCOMB_CHARACTER_MODEL: Honeycomb character model address.

HONEYCOMB_ASSEMBLER_CONFIG: Honeycomb assembler configuration address.

HONEYCOMB_PROJECT_ADDRESS: Honeycomb project address.

NEXT_PUBLIC_NFT_RECEIVING_WALLET=8VuJbQGpTU5SqmnKEdFJ1DnGQrD754eHCHrUiW6hdLHu

MONGO_URI= "mongodb+srv://clemzyumoh:LpQK1TyG4sTM2tCN@cluster0.yh0go.mongodb.net/SeaHorse"

NEXT_PUBLIC_BASE_URL=https://sea-horse.vercel.app

ADMIN_PRIVATE_KEY=4bp6XSjcPJjEnkbVj1fHqpLnrfLnio6LDVv5U8obgKToC2RATmviLUdQd3yscUdFX1qsoKHCyi6mjQC1GV7CKh2z
USDC_MINT_ADDRESS=EGcvNycAx1dkZUjm5GBgK5bj2sMNEK3cUhVwKLAXnyU9
ADMIN_SECRET_KEY=5Awq9dyRLgrQ3eQs5g137qrdBDKg3VxwpJYh2zQzrBQQgiUDomNx3CTJoMcG9zYKFSm3Phn2gvHQyYkwzQ6BFnh2
HONEYCOMB_RESOURCE_ADDRESS = "DFooAecVjAS2M9fgieJFDpHe4FJcTK6KWFwPaLXfxtgw",
HONEYCOMB_CHARACTER_MODEL= "9PKRZNqo8HYxibKUn5QJkS3jgw2brfLGLRw43fbMfh7Q"
HONEYCOMB_ASSEMBLER_CONFIG= "4zEZPFgmAfZcbpAtnTKLJL1RvajXtsD8Tgv3ztVjnVt7"
HONEYCOMB_PROJECT_ADDRESS="FFifh2cHzPHXtqvVdQKvmm2PNtLHSP4FhWQHWujBDotg"
RPC_URL=https://api.devnet.solana.com
WALLET_SECRET_KEY=[208,164,252,226,5,152,87,216,86,107,104,244,94,67,40,181,75,61,68,233,87,164,184,246,26,26,253,39,1,111,204,184,208,109,238,207,246,231,151,144,80,95,229,218,176,65,235,125,3,125,117,196,181,82,207,182,242,181,184,208,207,90,123,149]


4. Run the development server:
   ```
   npm run dev
   ```

The application will be available at `https://seahorse-seven.vercel.app/`.

## Usage

## API Endpoints

The application exposes the following API endpoints for backend operations (all under `/api/` prefix). 
Each supports specific HTTP methods based on functionality; refer to the source code for implementation details.

- `/api/fund` (POST): Funds a player's wallet with daily SOL and USDC claims.
- `/api/leaderboard` (GET): Retrieves leaderboard data based on on-chain player profiles.
- `/api/mission` (POST): Creates or manages missions for players.
- `/api/mission-pool` (POST): Creates mission pools to organize quests.
- `/api/mint-nft` (POST): Mints NFTs using Metaplex for players.
- `/api/setup/checkCharacter` (GET): Checks if a player has an existing character.
- `/api/setup/checkProfile` (GET): Checks if a player has an existing profile.
- `/api/setup/createAuth` (POST): Creates an authentication token for user access (e.g., admin authorization).
- `/api/setup/createResource` (POST): Creates game resources like XP.
- `/api/setup/createProfile` (POST): Creates a new player profile.
- `/api/setup/createCharacter` (POST): Creates a new character for the player.
- `/api/setup/createProject` (POST): Creates a Honeycomb project for the game.
- `/api/setup/updateCharacter` (POST): Updates an existing character.
- `/api/setup/updateProfile` (POST): Updates a player's profile (e.g., with XP or badges).
- `/api/setup/updateinitPlatformdata` (POST): Updates initial platform data configurations.

## Player Flow

1. **Onboarding Page**: Players enter a username and connect their wallet. The application checks for an existing profile and character; if absent, both are created using Honeycomb.
   
2. **Mission Hub Page**: Players claim daily SOL/USDC tokens and select missions. Missions unlock based on accumulated XP and completion of prior missions.

3. **Quest Page**: Triggered by starting a mission, players engage in gameplay (defeating mechanical fishes to earn XP within a time limit, e.g., 500 XP in 150 seconds). On completion, the profile updates with XP; badges are awarded only on first completion. Subsequent plays award XP only.

4. **NFT Page**: NFTs unlock based on player level. Using daily claims, players purchase via Solana Pay. Successful payments trigger NFT minting, XP awards, and display in the Mission Hub's NFT section and the player's wallet.

5. **Rankings Page**: Displays a leaderboard derived from on-chain player profiles, alongside individual player details.

## Integration with Honeycomb Protocol

Honeycomb powers the core on-chain mechanics:

- **Project Creation**: Establishes the game's on-chain structure.
- **Users and Profiles**: An admin user (with access token) authorizes missions. Player profiles store username, wallet address, level, badges, and NFT addresses, forming the basis for the leaderboard.
- **Character Creation**: Assembled characters for mission deployment.
- **Resources**: XP as an on-chain currency earned and tracked via missions and NFTs.
- **Missions and Pools**: Missions define quests; a mission pool manages availability and deployment.

This integration ensures all progression is verifiable, permanent, and portable.

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request with clear descriptions of changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
