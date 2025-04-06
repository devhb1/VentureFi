const fs = require('fs');
const path = require('path');
const hre = require('hardhat'); 

async function main() {
    // Compile the contract to ensure artifacts are generated
    console.log("Compiling contracts...");
    await hre.run('compile');

    // Deploy the Campaign contract
    const Campaign = await hre.ethers.getContractFactory("Campaign");
    console.log("Deploying contract...");
    const campaign = await Campaign.deploy();
    await campaign.deployed();
    console.log("Campaign deployed to:", campaign.address);

    // Paths for ABI and frontend
    const artifactsPath = path.resolve(__dirname, '../artifacts/contracts/Campaign.sol/Campaign.json');
    console.log("Artifacts Path:", artifactsPath);
    console.log("Artifacts Exists:", fs.existsSync(artifactsPath));
    const frontendPath = path.resolve(__dirname, '../../client/src/contracts/Campaign.json');

    // Ensure the artifacts file exists and copy it to the frontend
    if (fs.existsSync(artifactsPath)) {
        fs.copyFileSync(artifactsPath, frontendPath);
        console.log("ABI copied to frontend at:", frontendPath);
    } else {
        console.error("Artifacts not found. Please ensure the contract is compiled.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
 