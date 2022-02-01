require("@nomiclabs/hardhat-waffle");
require('solidity-coverage')
require('dotenv').config();
require('./tasks/donation-tasks')


const dotenv = require('dotenv');
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async hre => 
{
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) 
  {
    console.log(account.address);
  }

});



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = 
{
  defaultNetwork: "hardhat",
  networks: 
  {
    hardhat: 
    { 
      mining: { auto: true }
    },

    rinkeby: 
    {
      url: process.env.INFURA,
      accounts: [process.env.KEY]
    }
  },

  plugins: ['solidity-coverage'],
  
  solidity: 
  {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: 
  {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: 
  {
    timeout: 40000
  }
  
};
