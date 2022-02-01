const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const BigNumber = require("bignumber.js");
const truffleAssertions = require("truffle-assertions");


describe("Donation", () => 
{
  let instance;
  const provider = waffle.provider;
  let owner;

  beforeEach(async () => 
  {
    const Donation = await ethers.getContractFactory("Donation");
    [owner, acc1, acc2, acc3] = await ethers.getSigners();
    instance = await Donation.deploy();
  });

  it("donate(): should add new donator and eth to the contract", async () =>
  {
    let bal = await ethers.provider.getBalance(owner.address)
    let balanceETHContract = await provider.getBalance(instance.address)

    console.log(`Before:`)
    console.log(`Balance: ${bal / 10**18} ETH\nContract Eth balance: ${balanceETHContract / 10**18} ETH\n`)


    let donateTx = await instance.donate(
    {
      from: owner.address, 
      value: ethers.utils.parseEther('100.0')
    })

    await donateTx.wait();

    balanceETHContract = await provider.getBalance(instance.address);
    bal = await ethers.provider.getBalance(owner.address)

    console.log(`After:`)
    console.log(`Balance: ${bal / 10**18} ETH\nContract Eth balance: ${balanceETHContract / 10**18} ETH`)
    
    // check if user's balance is 100 eth less than before
    expect(await ethers.provider.getBalance(owner.address)).to.equal(bal);

    // check if contracts's balance is 100 eth more than before
    expect(await ethers.provider.getBalance(instance.address)).to.equal(balanceETHContract);
  })

  it("donators(): should print that list is empty", async () =>
  {
    await truffleAssertions.reverts(instance.donators())
  })

  describe("Donations check", async () =>
  {
    let donateTx
    beforeEach(async () => 
    {
      donateTx = await instance.donate(
      {
        from: owner.address, 
        value: ethers.utils.parseEther('50.0')
      })
      donateTx = await instance.connect(acc1).donate(
      {
        from: acc1.address, 
        value: ethers.utils.parseEther('0.15')
      })
      donateTx = await instance.connect(acc2).donate(
      {
        from: acc2.address, 
        value: ethers.utils.parseEther('1.0')
      })
    });


    it("donators(): should show list of donators and their amount", async () =>
    {
      await instance.donators()
    })


    it("getDonation(): should donated amount donators", async () =>
    {
      let donation = await instance.getDonation(owner.address)
      console.log(`${donation / 10**18} ETH`)
      
      donation = await instance.getDonation(acc1.address)
      console.log(`${donation / 10**18} ETH`)
      
      donation = await instance.getDonation(acc2.address)
      console.log(`${donation / 10**18} ETH`)

      expect(await instance.getDonation(owner.address)).to.equal('50000000000000000000');
      expect(await instance.getDonation(acc1.address)).to.equal('150000000000000000');
      expect(await instance.getDonation(acc2.address)).to.equal('1000000000000000000');
    })
  

    it("withdraw(): should withdraw donation to some account", async () => 
    {
      let amount = new BigNumber('10e18')
      let balanceBefore = await provider.getBalance(acc1.address)
      let balance = new BigNumber(balanceBefore.toBigInt())

      let balanceETHContractBefore = await provider.getBalance(instance.address)
      let balanceContract = new BigNumber(balanceETHContractBefore.toBigInt())
      
      await instance.connect(owner).withdraw(acc1.address, amount.toFixed())
      
      let balanceETHContractAfter = await provider.getBalance(instance.address)
    
      let balanceAfter = await provider.getBalance(acc1.address)

      expect(balanceAfter).to.equal(balance.plus(amount).toFixed());
      expect(balanceETHContractAfter).to.equal(balanceContract.minus(amount).toFixed());
    })


    it("withdraw(): should fail if not owner try to withdraw", async () => 
    {
      let amount = new BigNumber('10e18') 
      await truffleAssertions.reverts(instance.connect(acc1).withdraw(acc2.address, amount.toFixed()))
    })


    it("withdraw(): should fail if amount is too big", async () => 
    {
      let amount = new BigNumber('100e18') 
      await truffleAssertions.reverts(instance.connect(owner).withdraw(acc2.address, amount.toFixed()))
    })


    it("getDonator(): should return donator address by id", async () => 
    {
      let donator1 = await instance.getDonator(0)
      let donator2 = await instance.getDonator(1)
      let donator3 = await instance.getDonator(2)
      let donator4 = await instance.getDonator(3)
      expect(donator1).to.equal(owner.address);
      expect(donator2).to.equal(acc1.address);
      expect(donator3).to.equal(acc2.address);
      expect(donator4).to.equal(acc2.address);
    })

  })

  
})
