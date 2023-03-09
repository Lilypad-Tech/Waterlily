import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  BigNumber,
} from 'ethers'

const BASE_COST = BigNumber.from('650000000000000')
const DEFAULT_IMAGE_COST = BASE_COST.mul(BigNumber.from('250'))
const DEFAULT_IMAGE_COMMISSION = BASE_COST.mul(BigNumber.from('50'))

describe("ArtistAttribution", function () {
  
  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners()

    const LilypadEvents = await ethers.getContractFactory("LilypadEvents")
    const eventsContract = await LilypadEvents.deploy()
    await eventsContract.deployed()
    const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
    const artistContract = await ArtistAttribution.deploy(
      eventsContract.address,
      DEFAULT_IMAGE_COST,
      DEFAULT_IMAGE_COMMISSION,
    )
    await artistContract.deployed()
    return { eventsContract, artistContract, owner, otherAccount }
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { eventsContract, artistContract, owner, otherAccount } = await loadFixture(deployContracts)

      //expect(await lock.unlockTime()).to.equal(unlockTime)

      console.log('--------------------------------------------')
      console.log(eventsContract.address)
      console.log(artistContract.address)
    })
  })

})
