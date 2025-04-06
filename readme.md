# **VentureFi: Decentralized Fundraising Platform**

VentureFi is a decentralized fundraising platform built on Ethereum's blockchain. It empowers creators, entrepreneurs, and innovators to raise funds transparently and securely without intermediaries. The platform allows users to create campaigns, donate to active campaigns, and withdraw funds after campaigns end.

---

## **Features**

- **Decentralized Fundraising**: Campaigns are managed on the blockchain, ensuring transparency and security.
- **Wallet Integration**: Users can connect their wallets (e.g., MetaMask) to interact with the platform.
- **Campaign Management**: Users can create campaigns, view active and ended campaigns, and withdraw funds.
- **Real-Time Updates**: Campaign progress and deadlines are updated dynamically.

---

## **Control Flow and Workflow**

### **Frontend (React)**

1. **`App.jsx`**:
   - The entry point for the React application.
   - Defines routes for the application:
     - `/`: Home page.
     - `/campaigns`: Campaign listing page.
     - `/create-campaign`: Campaign creation page.
   - Wraps the app with the `WalletProvider` to manage wallet state globally.

2. **`HomePage.jsx`**:
   - Displays the landing page with options to connect a wallet, view campaigns, or create a campaign.
   - Provides navigation to `/campaigns` and `/create-campaign`.

3. **`CampaignList.jsx`**:
   - Displays active and ended campaigns.
   - Fetches campaign data from the blockchain and categorizes them based on their status (active or ended).
   - Allows users to donate to active campaigns or withdraw funds from ended campaigns (if they are the campaign creator).

4. **`CreateCampaign.jsx`**:
   - Provides a form for users to create a new campaign.
   - Interacts with the smart contract to create campaigns on the blockchain.
   - Fetches available campaign durations from the smart contract.

5. **`WalletContext.jsx`**:
   - Manages wallet connection state globally.
   - Provides functions to connect and disconnect wallets.
   - Shares the connected wallet address across the app.

6. **`WalletConnect.jsx`**:
   - A reusable component for connecting wallets.
   - Updates the wallet state in the `WalletContext`.

---

### **Backend (Smart Contract)**

1. **`Campaign.sol`**:
   - The core smart contract that manages campaigns.
   - **Key Functions**:
     - `createCampaign`: Allows users to create a new campaign.
     - `donate`: Allows users to donate to active campaigns.
     - `withdrawFunds`: Allows campaign creators to withdraw funds after the campaign ends.
     - `getDonors`: Fetches the list of donors and their contributions for a campaign.
     - `getDurations`: Returns predefined campaign durations.

2. **`deploy.js`**:
   - A script to deploy the `Campaign.sol` smart contract to the blockchain.
   - Copies the contract's ABI to the frontend for integration.

---

## **Workflow of Files**

### **Frontend Workflow**

1. **User Interaction**:
   - Users interact with the UI components (`HomePage`, `CampaignList`, `CreateCampaign`).
   - Wallet connection is managed by `WalletContext`.

2. **Blockchain Interaction**:
   - The frontend interacts with the smart contract using `ethers.js`.
   - Contract ABI is imported from `client/src/contracts/Campaign.json`.

3. **State Management**:
   - Campaign data is fetched and managed using React state hooks (`useState`, `useEffect`).

### **Backend Workflow**

1. **Smart Contract**:
   - The `Campaign.sol` contract handles all campaign-related logic.
   - Deployed to the blockchain using `deploy.js`.

2. **Integration**:
   - The contract's ABI and address are used in the frontend to interact with the blockchain.

---

## **Step-by-Step Process to Build the Project**

### **1. Set Up the Project**

```bash
mkdir BASIC-WEB3-FUNDRAISING-APP
cd BASIC-WEB3-FUNDRAISING-APP
npx create-react-app client
mkdir backend
cd backend
npm init -y
npm install --save-dev hardhat
npx hardhat
npx hardhat clean
npx hardhat compile
npm run deploy:baseMainnet
```

### **2. Write the Smart Contract**

Create the `Campaign.sol` file in `backend/contracts/`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaign {
    ... // Smart contract logic
}
```

Add functions for creating campaigns, donating, withdrawing funds, and fetching campaign data.

### **3. Compile and Deploy the Contract**

Compile the contract:

```bash
npx hardhat compile
```

Write the deployment script in `backend/scripts/deploy.js`:

```javascript
const hre = require('hardhat');

async function main() {
    const Campaign = await hre.ethers.getContractFactory("Campaign");
    const campaign = await Campaign.deploy();
    await campaign.deployed();
    console.log("Campaign deployed to:", campaign.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

### **4. Set Up the Frontend**

Navigate to the client directory:

```bash
cd ../client
```

Install dependencies:

```bash
npm install ethers react-router-dom
```

Copy the contract ABI to `client/src/contracts/Campaign.json`.

### **5. Build the Frontend**

Create the following components:

- **`HomePage.jsx`**: Landing page with wallet connection and navigation.
- **`CampaignList.jsx`**: Displays active and ended campaigns.
- **`CreateCampaign.jsx`**: Form to create a new campaign.
- **`WalletContext.jsx`**: Manages wallet connection state.

Set up routing in `App.jsx`:

```jsx
<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/campaigns" element={<CampaignList />} />
    <Route path="/create-campaign" element={<CreateCampaign />} />
</Routes>
```

### **6. Test the Application**

Start the frontend:

```bash
npm start
```

Test the following:

- Wallet connection.
- Campaign creation.
- Donation functionality.
- Withdrawal functionality.

### **7. Deploy the Application**

- Deploy the smart contract to a testnet (e.g., Goerli, Sepolia).
- Host the frontend using a platform like Vercel or Netlify.

---

## **Technologies Used**

- **Frontend**: React, Tailwind CSS, ethers.js
- **Backend**: Solidity, Hardhat
- **Blockchain**: Ethereum (or compatible networks)

---

## **Future Enhancements**

- Add support for campaign images.
- Implement user authentication using Web3.
- Add analytics for campaign performance.

