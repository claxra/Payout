// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Company.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

error NoEtherSent();

/**
 * @title CompanyFactory
 * @dev This contract is used to deploy new Company contracts
 */
contract CompanyFactory {
    address public immutable companyTemplate;
    address[] public companies;
    uint256 public companyCount;

    event CompanyCreated(address indexed company);

    /**
     * @dev Constructor to create a company template which will be used to deploy new companies
     */
    constructor() {
        companyTemplate = address(new Company());
    }

    /**
     * @dev This function is used to deploy new Company contracts
     * @param _name The name of the company
     */
    function createCompany(string memory _name)
        public
        payable
        returns (address)
    {
        if (msg.value <= 0) revert NoEtherSent();

        address clone = Clones.clone(companyTemplate);

        Company(clone).initialize{value: msg.value}(
            msg.sender,
            _name
        );

        companies.push(clone);
        companyCount++;
        emit CompanyCreated(clone);

        return clone;
    }

    /**
     * @dev This function is used to transfer funds to employess for all companies, its called automatically by chailink automation
     */
    function transferFundsToEmployeesForAllCompanies() public {
        for (uint256 i = 0; i < companies.length; i++) {
            try Company(companies[i]).transferFundsToEmployees() {
            } catch {
                continue;
            }
        }
    }
}
