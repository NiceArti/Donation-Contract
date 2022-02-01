require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");

// tasks for rinkeby testnet
const deployedAddress = "0xeDAC0b1Df9F88426e613DCcf43AED5c675A59773";

task("donate", "Donate ether from your balance")
.addParam("value", "The ether value you donate", 0, types.int)
.setAction(async taskArgs => 
{
    const Donation = await ethers.getContractFactory("Donation");
    const instance = await Donation.attach(deployedAddress);

    await instance.donate({value: taskArgs.value})
    console.log(`Thank you for donation\nYou donated ${taskArgs.value} WEI`)
});


task("withdraw", "Send ether to specific address")
.addParam("address", "Address of recepient")
.addParam("amount", "The ether amount you withdraw", 0, types.int)
.setAction(async taskArgs => 
{
    const Donation = await ethers.getContractFactory("Donation");
    const instance = await Donation.attach(deployedAddress);

    await instance.withdraw(taskArgs.address, taskArgs.amount)
    console.log(`${taskArgs.address} receives donation fond of ${taskArgs.amount} WEI`)
});


task("donators-list", "Prints list of donators and their donations")
.setAction(async () => 
{
    const Donation = await ethers.getContractFactory("Donation");
    const instance = await Donation.attach(deployedAddress);

    let donators = await instance.donators()

        console.log(donators);
    
});


task("donated-from", "Prints an account's donation")
.addParam("address", "Address of donator")
.setAction(async taskArgs => 
{
    const Donation = await ethers.getContractFactory("Donation");
    const instance = await Donation.attach(deployedAddress);

    let donation = await instance.getDonation(taskArgs.address)
    console.log(`${taskArgs.address} donated: ${donation}`)
});
