import { Schema, model, models } from "mongoose";

const employeeSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  pensionStartDate: {
    type: Date,
    required: true,
  },
  pensionDuration: {
    type: Number,
    required: true,
  },
  monthlyAmount: {
    type: Number,
    required: true,
  },
  employeeJoiningDate: {
    type: Date,
    required: true,
  },
  employeeLeavingDate: Date,
  minimumServiceRequired: {
    type: Number,
    required: true,
  },
});

const Employee = models.Employee || model("Employee", employeeSchema);

export default Employee;
