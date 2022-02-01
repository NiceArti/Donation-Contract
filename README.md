# Donation contract (test)

This contract is made for make donation fond 

Contract address: 0xeDAC0b1Df9F88426e613DCcf43AED5c675A59773


Try running some of the following tasks:

| Task | Description |
| --- | --- |
| `npx hardhat donate --value some_value --network rinkeby` | Donate some value of wei in contract |
| `npx hardhat donators-list --network rinkeby` | Shows list of all donators |
| `npx hardhat donated-from --address some_address --network rinkeby` | Show donation added by this donator |
| `npx hardhat withdraw --address some_address --amount some_value --network rinkeby` | Sends donation to some address (only owner can call this function) |

