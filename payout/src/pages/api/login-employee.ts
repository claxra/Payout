import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Company from "@/models/Company";

interface EmployeeLoginResponse {
  employee: typeof Employee;
  company: typeof Company;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeLoginResponse | string>
) {
  if (req.method === "POST") {
    await connectMongo();
    const { address } = req.body;
    // @ts-ignore
    const employee = await Employee.findOne({ address });
    console.log(employee);
    if (!employee) {
      res
        .status(404)
        .json("Employee not found. Please check your address and try again.");
    }
    // @ts-ignore
    const company = await Company.findById(employee.company);
    res.status(200).json({ employee, company });
  } else {
    res.status(405).end();
  }
}
