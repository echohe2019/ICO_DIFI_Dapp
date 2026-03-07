const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log('Deploying contract with the account: ' + deployer.address);
    console.log("Account balance",await deployer.getBalance(),toString());

    const network = await hre.ethers.provider.getNetwork();
    console.log("Network:", network.name);

    console.log("Deploying TOKENICO contract...");
    const TokenICO = await hre.ethers.getContractFactory("TokenICO");
    const tokenICO = await TokenICO.deploy();
    await tokenICO.deployed();

    console.log('Deployment successfully deployed!');
    console.log("---------------------------------");
    console.log('NEXT_PUBLIC_TOKEN_ICO_ADDRESS', tokenICO.address);
    console.log('NEXT_PUBLIC_TOKEN_OWNER_ADDRESS', deployer.address);

    console.log("Deploying LINKTUN contract...");
    const LINKTUM = await hre.ethers.getContractFactory("LINKTUM");
    const linktum = await LINKTUM.deploy();
    await linktum.deployed();

    console.log('Deployment successfully deployed!');
    console.log("---------------------------------");
    console.log('NEXT_PUBLIC_TOKEN_LINKTUM_ADDRESS', linktum.address);
    console.log('NEXT_PUBLIC_TOKEN_OWNER_ADDRESS', deployer.address);
}

main()
    .then(() => process.exit(0)).catch((error) => {
        console.err(error);
        process.exit(1);
})
