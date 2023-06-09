import { Contract, ethers } from "ethers";
import { useContract, useSigner } from "wagmi";
import CompanyFactoryContract from "@/contracts/CompanyFactory.json";

export const useCompanyFactory = () => {
  const { data: signer } = useSigner();

  const companyFactoryContract = useContract({
    address: CompanyFactoryContract.address,
    abi: CompanyFactoryContract.abi,
    signerOrProvider: signer,
  });

  const createCompany = async (name: string): Promise<string> => {
    console.log("Company Factory", companyFactoryContract);

    const companyAddressHash = await companyFactoryContract!.createCompany(
      name,
      {
        value: ethers.utils.parseEther("0.000001"),
      }
    );
    await companyAddressHash!.wait();

    const companyCount = await companyFactoryContract!.companyCount();
    const companyAddress = await companyFactoryContract!.companies(
      companyCount - 1
    );

    console.log("company address", companyAddress);

    await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address: companyAddress,
        ownerAddress: await signer?.getAddress(),
      }),
    });
    console.log("registered company on server");
    return companyAddress;
  };

  return { companyFactoryContract, createCompany };
};
