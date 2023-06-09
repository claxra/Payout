import PapaParse from "papaparse";
import CompanyContract from "@/contracts/Company.json";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { ethers, Contract } from "ethers";
import { Signer } from "@wagmi/core";
import { getSolidityDate, yearsToSeconds, ddmmyyToDate } from "@/lib/helper";
import { notification } from "antd";
import { useRouter } from "next/router";

interface EmployeeData {
  employeeAddress: string;
  pensionStartDate: Date;
  pensionDuration: number;
  monthlyAmount: number;
  employeeJoiningDate: Date;
  employeeLeavingDate: Date;
  minimumServiceRequired: number;
}

export const useCompany = () => {
  const [companyContract, setCompanyContract] = useState<Contract>();
  const router = useRouter();

  const { data: signer } = useSigner();

  useEffect(() => {
    const address = localStorage.getItem("companyAddress");
    if (address) {
      const companyContract = new ethers.Contract(
        address,
        CompanyContract.abi,
        signer as Signer
      );
      setCompanyContract(companyContract);
    } else {
      if (localStorage.getItem("isCompany") === "true") {
        const companyData = JSON.parse(
          localStorage.getItem("company") as string
        );
        setCompanyContract(
          new ethers.Contract(
            companyData.address,
            CompanyContract.abi,
            signer as Signer
          )
        );
      }
    }
  }, [signer]);

  const addAddress = (address: string) => {
    localStorage.setItem("companyAddress", address);
    const companyContract = new ethers.Contract(
      address,
      CompanyContract.abi,
      signer as Signer
    );
    setCompanyContract(companyContract);
  };

  const uploadCsv = async (file: any, companyAddress: string) => {
    console.log("Starting upload");
    if (!companyContract) {
      console.log("creating company contract");
      const companyContract = new ethers.Contract(
        companyAddress,
        CompanyContract.abi,
        signer as Signer
      );
      setCompanyContract(companyContract);
    }
    console.log("uploading csv", file);
    if (!companyContract || !file) return;
    const reader = new FileReader();
    const blob = new Blob([file.originFileObj], { type: "text/csv" });
    reader.readAsText(blob);
    reader.onload = async (e) => {
      const csv = e.target?.result;
      const results = PapaParse.parse(csv as string, {
        header: false,
      });
      const data = results.data;
      const csvData: EmployeeData[] = data.map((row: any) => {
        return {
          employeeAddress: row[0],
          pensionStartDate: ddmmyyToDate(row[1]),
          pensionDuration: row[2],
          monthlyAmount: row[3],
          employeeJoiningDate: ddmmyyToDate(row[4]),
          employeeLeavingDate: ddmmyyToDate(row[5]),
          minimumServiceRequired: row[6],
        };
      });
      console.log("adding employees to blockchain", csvData);
      await companyContract.addEmployees(
        csvData.map((row) => row.employeeAddress),
        csvData.map((row) => getSolidityDate(row.pensionStartDate)),
        csvData.map((row) => yearsToSeconds(row.pensionDuration)),
        csvData.map((row) => row.monthlyAmount),
        csvData.map((row) => getSolidityDate(row.employeeJoiningDate)),
        csvData.map((row) => getSolidityDate(row.employeeLeavingDate)),
        csvData.map((row) => yearsToSeconds(row.minimumServiceRequired))
      );
      console.log("adding employees to mongodb");
      await fetch("/api/add-employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyAddress: companyContract.address,
          employees: csvData,
        }),
      }).then(() => {
        notification.success({
          message: "Success",
          description: "Company created successfully",
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      });
    };
  };

  return { companyContract, uploadCsv, addAddress };
};
