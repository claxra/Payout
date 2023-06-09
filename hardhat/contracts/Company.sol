// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

error EmployeeAlreadyExists();
error InsufficientFunds();

struct Employee {
    uint256 pensionStartDate;
    uint256 pensionDuration;
    uint256 monthyAmount;
    uint256 employeeJoiningDate;
    uint256 employeeLeavingDate;
    uint256 minimumServiceRequired;
}

// creating the Request struct definition
struct CryptoProposal {
    string title;
    string description;
    uint256 deadline;
    uint256 value;
    address currencyAddress;
    bool complete;
    uint256 approvalCount; // number of yes
    mapping(address => bool) votes; // mapping for the people who have voted
}
struct W2wProposal {
    string title;
    string description;
    uint256 deadline;
    uint256 value;
    address payable targetAddress;
    bool complete;
    uint256 approvalCount; // number of yes
    mapping(address => bool) votes; // mapping for the people who have voted
}

/**
 * @title Company
 * @dev This contract is used to store the details of a company and the pension details of its employees
 */
contract Company is Initializable, OwnableUpgradeable {
    // basic details of the company
    string public name;
    mapping(address => Employee) public employees;
    address payable[] public employeeAddresses;

    // DAO related details
    uint256 noOfCryptoProposals;
    mapping(uint256 => CryptoProposal) cryptoProposals;
    uint256 noOfW2wProposals;
    mapping(uint256 => W2wProposal) w2wProposals;

    // Pension automtation related details
    uint256 internal lastDistributionTime;
    uint256 public pensionCounter;

    // Uniswap related details
    ISwapRouter public swapRouter;

    // pension tranfer events
    event CompanyPensionTransferSucceeded(
        address indexed company,
        uint256 amount
    );
    event CompanyPensionTransferFailed(address indexed company);

    // DAO related events
    event CryptoProposalCreated(
        uint256 indexed proposalId,
        string description,
        uint256 value,
        address currencyAddress
    );
    event CryptoProposalVoted(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote
    );
    event CryptoProposalCompleted(
        uint256 indexed proposalId,
        bool success,
        uint256 amount
    );
    event W2wProposalCreated(
        uint256 indexed proposalId,
        string description,
        uint256 value,
        address targetAddress
    );
    event W2wProposalVoted(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote
    );
    event W2wProposalCompleted(
        uint256 indexed proposalId,
        bool success,
        uint256 amount
    );

    // UTILITY FUNCTIONS

    /**
     * @dev This function is used to check if an address is an employee or not
     * @param addressToFind The address to be checked
     */
    function isAddressInEmployee(address addressToFind)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < employeeAddresses.length; i++) {
            if (employeeAddresses[i] == addressToFind) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev This function is used to initialize the contract
     * @param _owner The owner of the contract
     * @param _name The name of the company
     */
    function initialize(address _owner, string memory _name)
        public
        payable
        initializer
    {
        __Ownable_init();
        transferOwnership(_owner);
        name = _name;

        // uniswap router for eth & polygon (mainnet & testnet)
        swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

        lastDistributionTime = block.timestamp;
        pensionCounter = 0;
    }

    // UNISWAP RELATED FUNCTIONS

    /**
     * @dev This function is used to swap MATIC to any token
     * @param inputAmount The amount of MATIC to be swapped
     * @param requiredTokenAddress The address of the token to be swapped to
     */
    // function swapTokens(uint256 inputAmount, address requiredTokenAddress) internal returns (uint256 amountOut) {
    //     // msg.sender must approve this contract
    //     require(inputAmount < address(this).balance, 'Insufficient balance');

    //     address WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;

    //     // Approve the router to spend MATIC.
    //     TransferHelper.safeApprove(MATIC, address(swapRouter), inputAmount);

    //     ISwapRouter.ExactInputSingleParams memory params =
    //         ISwapRouter.ExactInputSingleParams({
    //             tokenIn: MATIC,
    //             tokenOut: requiredTokenAddress,
    //             fee: 3000,
    //             recipient: msg.sender,
    //             deadline: block.timestamp,
    //             amountIn: inputAmount,
    //             amountOutMinimum: 0,
    //             sqrtPriceLimitX96: 0
    //         });

    //     // The call to `exactInputSingle` executes the swap.
    //     amountOut = swapRouter.exactInputSingle(params);
    // }

    // DAO RELATED FUNCTIONS

    /**
     * @dev This function is used to create a new crypto proposal
     * @param _description The description of the proposal
     * @param _value The value of the proposal
     * @param _currencyAddress The currencyAddress of the proposal
     */
    function createCryptoProposal(
        string memory _title,
        string memory _description,
        uint256 _deadline,
        uint256 _value,
        address _currencyAddress
    ) public onlyOwner {
        CryptoProposal storage newRequest = cryptoProposals[noOfCryptoProposals++];
        newRequest.title = _title;
        newRequest.description = _description;
        newRequest.deadline = _deadline;
        newRequest.value = _value;
        newRequest.currencyAddress = _currencyAddress;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    /**
     * @dev This function is used to create a new w2w proposal
     * @param _description The description of the proposal
     * @param _value The value of the proposal
     * @param _targetAddress The targetAddress of the proposal
     */
    function createW2wProposal(
        string memory _title,
        string memory _description,
        uint256 _deadline,
        uint256 _value,
        address _targetAddress
    ) public onlyOwner {
        W2wProposal storage newRequest = w2wProposals[noOfW2wProposals++];
        newRequest.title = _title;
        newRequest.description = _description;
        newRequest.deadline = _deadline;
        newRequest.value = _value;
        newRequest.targetAddress = payable(_targetAddress);
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    /**
     * @dev This function is used to approve a crypto proposal
     * @param proposalIndex The index of the proposal to be approved
     */
    function approveCryptoProposal(uint256 proposalIndex) public {
        // checking if the caller of the function is an approver or not
        require(
            isAddressInEmployee(msg.sender) &&
                block.timestamp < cryptoProposals[proposalIndex].deadline
        );

        CryptoProposal storage currProposal = cryptoProposals[proposalIndex];

        // checking if the current approver hasnt voted before or not
        require(!currProposal.votes[msg.sender]);

        currProposal.votes[msg.sender] = true;
        currProposal.approvalCount++;
    }

    /**
     * @dev This function is used to approve a w2w proposal
     * @param proposalIndex The index of the proposal to be approved
     */
    function approveW2wProposal(uint256 proposalIndex) public {
        // checking if the caller of the function is an approver or not
        require(
            isAddressInEmployee(msg.sender) &&
                block.timestamp < w2wProposals[proposalIndex].deadline
        );

        W2wProposal storage currProposal = w2wProposals[proposalIndex];

        // checking if the current approver hasnt voted before or not
        require(!currProposal.votes[msg.sender]);

        currProposal.votes[msg.sender] = true;
        currProposal.approvalCount++;
    }

    /**
     * @dev This function is used to finalize a crypto proposal
     * @param proposalIndex The index of the proposal to be finalized
     */
    function finalizeCryptoProposal(uint256 proposalIndex) public onlyOwner {
        CryptoProposal storage currProposal = cryptoProposals[proposalIndex];

        require(currProposal.approvalCount > (employeeAddresses.length / 2));

        require(!currProposal.complete);

        // TODO: swap tokens
        // swapTokens(currProposal.value, currProposal.currencyAddress);

        currProposal.complete = true;
    }

    /**
     * @dev This function is used to finalize a w2w proposal
     * @param proposalIndex The index of the proposal to be finalized
     */
    function finalizeW2wProposal(uint256 proposalIndex) public onlyOwner {
        W2wProposal storage currProposal = w2wProposals[proposalIndex];

        require(currProposal.approvalCount > (employeeAddresses.length / 2));

        require(!currProposal.complete);

        currProposal.targetAddress.transfer(currProposal.value);

        currProposal.complete = true;
    }

    // PENSION RELATED FUNCTIONS

    /**
     * @dev This function is used to transfer funds to employess, its called automatically by performUpKeep
     */
    function transferFundsToEmployees() external {
        uint256 amountToDistribute = 0;

        uint256 interval = 2629056; // 1 month in seconds
        // uint256 interval = 60; // for dev

        // Check if it is time to distribute funds
        if (block.timestamp >= lastDistributionTime + interval) {
            for (uint256 i = 0; i < employeeAddresses.length; i++) {
                // distribute pension to employees who have retired only
                if (
                    employees[employeeAddresses[i]].employeeLeavingDate -
                        employees[employeeAddresses[i]].employeeJoiningDate >=
                    employees[employeeAddresses[i]].minimumServiceRequired
                )
                    amountToDistribute += employees[employeeAddresses[i]]
                        .monthyAmount;
            }

            if (address(this).balance < amountToDistribute) {
                emit CompanyPensionTransferFailed(address(this));
                revert InsufficientFunds();
            }

            // Transfer funds
            for (uint256 i = 0; i < employeeAddresses.length; i++) {
                if (
                    employees[employeeAddresses[i]].employeeLeavingDate -
                        employees[employeeAddresses[i]].employeeJoiningDate >=
                    employees[employeeAddresses[i]].minimumServiceRequired
                )
                    employeeAddresses[i].transfer(
                        employees[employeeAddresses[i]].monthyAmount
                    );
            }

            emit CompanyPensionTransferSucceeded(
                address(this),
                amountToDistribute
            );

            // Update the last distribution time
            pensionCounter = pensionCounter + 1;
            lastDistributionTime = block.timestamp;
        }
    }

    /**
     * @dev This function is used to change the name of the company
     * @param _name The new name of the company
     */
    function changeName(string memory _name) public onlyOwner {
        name = _name;
    }

    /**
     * @dev This function is used to add a new employee to the company
     * @param _employeeAddress The address of the employee
     * @param _pensionStartDate The date from which the pension will start
     * @param _pensionDuration The duration of the pension
     * @param _monthyAmount The amount of pension to be paid monthly
     * @param _employeeJoiningDate The date on which the employee joined the company
     * @param _employeeLeavingDate The date on which the employee left the company
     * @param _minimumServiceRequired The minimum service required by the employee to be eligible for pension
     *
     */
    function addEmployee(
        address _employeeAddress,
        uint256 _pensionStartDate,
        uint256 _pensionDuration,
        uint256 _monthyAmount,
        uint256 _employeeJoiningDate,
        uint256 _employeeLeavingDate,
        uint256 _minimumServiceRequired
    )
        public
        // bool _employeeActive
        onlyOwner
    {
        if (employees[_employeeAddress].employeeJoiningDate > 0)
            revert EmployeeAlreadyExists();

        employees[_employeeAddress] = Employee(
            _pensionStartDate,
            _pensionDuration,
            _monthyAmount,
            _employeeJoiningDate,
            _employeeLeavingDate,
            _minimumServiceRequired
        );
        employeeAddresses.push(payable(_employeeAddress));
    }

    /**
     * @dev This function is used to add multiple employees to the company
     * @param _employeeAddresses The addresses of the employees
     * @param _pensionStartDates The dates from which the pension will start
     * @param _pensionDurations The durations of the pension
     * @param _monthyAmounts The amounts of pension to be paid monthly
     * @param _employeeJoiningDates The dates on which the employees joined the company
     * @param _employeeLeavingDates The dates on which the employees left the company
     * @param _minimumServiceRequireds The minimum service required by the employees to be eligible for pension
     */
    function addEmployees(
        address[] memory _employeeAddresses,
        uint256[] memory _pensionStartDates,
        uint256[] memory _pensionDurations,
        uint256[] memory _monthyAmounts,
        uint256[] memory _employeeJoiningDates,
        uint256[] memory _employeeLeavingDates,
        uint256[] memory _minimumServiceRequireds
    ) public onlyOwner {
        for (uint256 i = 0; i < _employeeAddresses.length; i++) {
            if (employees[_employeeAddresses[i]].employeeJoiningDate > 0)
                revert EmployeeAlreadyExists();
        }
        for (uint256 i = 0; i < _employeeAddresses.length; i++) {
            employeeAddresses.push(payable(_employeeAddresses[i]));
            employees[_employeeAddresses[i]] = Employee(
                _pensionStartDates[i],
                _pensionDurations[i],
                _monthyAmounts[i],
                _employeeJoiningDates[i],
                _employeeLeavingDates[i],
                _minimumServiceRequireds[i]
            );
        }
    }

    /**
     * @dev This function is used to get the details of all the employees of the company
     */
    function getEmployees()
        external
        view
        onlyOwner
        returns (Employee[] memory)
    {
        Employee[] memory _employees = new Employee[](employeeAddresses.length);
        for (uint256 i = 0; i < employeeAddresses.length; i++) {
            _employees[i] = employees[employeeAddresses[i]];
        }
        return _employees;
    }

    /**
     * @dev This function is used to get the details of a particular employee of the company
     * @param _employeeAddress The address of the employee
     */
    function getEmployee(address _employeeAddress)
        external
        view
        onlyOwner
        returns (Employee memory)
    {
        return employees[_employeeAddress];
    }

    /**
     * @dev This function is used to update the details of a particular employee of the company
     * @param _employeeAddress The address of the employee
     * @param _pensionStartDate The date from which the pension will start
     * @param _pensionDuration The duration of the pension
     * @param _monthyAmount The amount of pension to be paid monthly
     * @param _employeeJoiningDate The date on which the employee joined the company
     * @param _employeeLeavingDate The date on which the employee left the company
     * @param _minimumServiceRequired The minimum service required by the employee to be eligible for pension
     *
     */
    function updateEmployee(
        address _employeeAddress,
        uint256 _pensionStartDate,
        uint256 _pensionDuration,
        uint256 _monthyAmount,
        uint256 _employeeJoiningDate,
        uint256 _employeeLeavingDate,
        uint256 _minimumServiceRequired
    )
        public
        // bool _employeeActive
        onlyOwner
    {
        employees[_employeeAddress] = Employee(
            _pensionStartDate,
            _pensionDuration,
            _monthyAmount,
            _employeeJoiningDate,
            _employeeLeavingDate,
            _minimumServiceRequired
        );
    }
}
