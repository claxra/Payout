import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/lib/mongodb";
import Company from "@/models/Company";

interface CompanyLoginResponse {
  company: typeof Company;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompanyLoginResponse | string>
) {
  if (req.method === "POST") {
    await connectMongo();
    const { ownerAddress } = req.body;
    // @ts-ignore
    const company = await Company.findOne({ ownerAddress });
    if (!company) {
      res
        .status(404)
        .json("Company not found. Please check your address and try again.");
    }
    res.status(200).json({ company });
  } else {
    res.status(405).end();
  }
}
