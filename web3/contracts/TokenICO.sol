// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract TokenICO {
    address public immutable owner;
    address public saleToken;
    uint256 public ethPriceForToken = 0.001 ether;
    uint256 public tokensSold;
    // events
    event TokensPurchased(
        address indexed buyer,
        uint256 amountPaid,
        uint256 tokensBought
    );
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event SaleTokenSet(address indexed token);

    // state variables
    error OnlyOwner();
    error InvalidPrice();
    error InvalidAddress();
    error NoEthSent();
    error SaleTokeNotSet();
    error TokenTransferFailed();
    error EthTransferFailed();
    error NoTokensToWithdraw();
    error CannotRescueSaleToken();
    error NoTokensToRescue();
    error UseTokenFunction();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        revert UseTokenFunction();
    }

    function updateTokenPrice(uint256 newPrice) external onlyOwner {
        if (newPrice == 0) revert InvalidPrice();
        uint256 oldPrice = ethPriceForToken;
        ethPriceForToken = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }
    function setSaleToken(address _token) external onlyOwner {
        if (_token == address(0)) revert InvalidAddress();
        saleToken = _token;
        emit SaleTokenSet(_token);
    }
    function withdrawAllTokens() external onlyOwner {
        address token = saleToken;
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance == 0) revert NoTokensToWithdraw();
        if (!IERC20(token).transfer(owner, balance))
            revert TokenTransferFailed();
    }

    function buyTokens() external payable {
        if (msg.value == 0) revert NoEthSent();
        address token = saleToken;
        if (token == address(0)) revert SaleTokeNotSet();

        IERC20 tokenContract = IERC20(token);
        uint8 decimals = tokenContract.decimals();
        uint256 tokenAmount = (msg.value * (10 ** decimals)) / ethPriceForToken;
        unchecked {
            tokensSold += tokenAmount;
        }

        if (!tokenContract.transfer(msg.sender, tokenAmount))
            revert TokenTransferFailed();

        (bool success, ) = owner.call{value: msg.value}("");
        if (!success) revert EthTransferFailed();

        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }
    function rescueTokens(address tokenAddress) external onlyOwner {
        if (tokenAddress == saleToken) revert CannotRescueSaleToken();
        IERC20 tokenContract = IERC20(tokenAddress);
        uint256 balance = tokenContract.balanceOf(address(this));
        if (balance == 0) revert NoTokensToRescue();
        if (!tokenContract.transfer(owner, balance))
            revert TokenTransferFailed();
    }

    function getContractInfo()
        external
        view
        returns (
            address tokenAddress,
            string memory tokenSymbol,
            uint8 tokenDecimals,
            uint256 tokenBalance,
            uint256 ethPrice,
            uint256 totalSold
        )
    {
        address token = saleToken;
        IERC20 tokenContract = IERC20(token);

        return (
            token,
            tokenContract.symbol(),
            tokenContract.decimals(),
            tokenContract.balanceOf(address(this)),
            ethPriceForToken,
            tokensSold
        );
    }
}
