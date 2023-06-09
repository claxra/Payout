import { ethers } from "hardhat";

async function main() {
  const CompanyFactory = await ethers.getContractFactory("CompanyFactory");
  const companyFactory = await CompanyFactory.deploy();

  await companyFactory.deployed();

  console.log(`Company Factory deployed to address: ${companyFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
