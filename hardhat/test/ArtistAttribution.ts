import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import type { ArtistAttribution } from '../typechain-types/contracts/ArtistAttribution';

const BASE_COST = BigNumber.from('650000000000000')
const DEFAULT_IMAGE_COST = BASE_COST.mul(BigNumber.from('250'))
const DEFAULT_IMAGE_COMMISSION = BASE_COST.mul(BigNumber.from('50'))

describe("ArtistAttribution", function () {
  
  const getDeployContracts = ({
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    async function deployContracts() {
      const [owner, customerAccount, artist1Account, artist2Account] = await ethers.getSigners()
      const LilypadEvents = await ethers.getContractFactory("LilypadEvents")
      const eventsContract = await LilypadEvents.deploy()
      await eventsContract.deployed()
      const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
      const artistContract = await ArtistAttribution.deploy(
        eventsContract.address,
        imageCost,
        imageCommission,
      )
      await artistContract.deployed()
      return { eventsContract, artistContract, owner, customerAccount, artist1Account, artist2Account }
    }
    return deployContracts
  }

  const checkArtistBalance = (
    artist: ArtistAttribution.ArtistStructOutput,
    escrow = 0,
    revenue = 0,
    numJobsRun = 0,
  ) => {
    expect(artist.escrow).to.equal(BigNumber.from(escrow))
    expect(artist.revenue).to.equal(BigNumber.from(revenue))
    expect(artist.numJobsRun).to.equal(BigNumber.from(numJobsRun))
  }

  describe("Deployment", function () {
    it("Should fail to deploy if the commission is more than the price", async function () {
      const LilypadEvents = await ethers.getContractFactory("LilypadEvents")
      const eventsContract = await LilypadEvents.deploy()
      await eventsContract.deployed()
      const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
      await expect(ArtistAttribution.deploy(
        eventsContract.address,
        DEFAULT_IMAGE_COST,
        DEFAULT_IMAGE_COST.add(BigNumber.from('1')),
      )).to.be.revertedWith(
        'artist commission must be less than image cost'
      )
    })
  })
  
  describe("Artists", function () {
    it("Should only allow admin to add or delete artists", async function () {
      const { artistContract, customerAccount, artist1Account, artist2Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).updateArtist('artist1', artist1Account.address, '123')).to.be.reverted
      await expect(artistContract.connect(customerAccount).deleteArtist('artist1')).to.be.reverted
    })

    it("Should allow the addition of multiple artists", async function () {
      const { artistContract, artist1Account, artist2Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.updateArtist('artist2', artist2Account.address, '456')).not.to.be.reverted
      expect(await artistContract.getArtistIDs()).to.deep.equal(['artist1', 'artist2'])
      await expect(artistContract.deleteArtist('artist2')).not.to.be.reverted
      expect(await artistContract.getArtistIDs()).to.deep.equal(['artist1'])

      const artist1 = await artistContract.getArtist('artist1')

      expect(artist1.id).to.equal('artist1')
      expect(artist1.wallet).to.equal(artist1Account.address)
      expect(artist1.metadata).to.equal('123')
      checkArtistBalance(artist1, 0, 0 ,0)
    })
  })

  describe("Image", function () {
    it("Should revert when the artist ID is wrong", async function () {
      const { artistContract, customerAccount } = await loadFixture(getDeployContracts())
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world')).to.be.revertedWith(
        'artist does not exist'
      )
    })

    it("Should revert when not enough FIL has been sent", async function () {
      const { artistContract, customerAccount, artist1Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world')).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: DEFAULT_IMAGE_COST.sub(BigNumber.from('1')),
      })).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).not.to.be.reverted
    })

    it("Should emit an event from the events contract", async function () {
      const { eventsContract, artistContract, customerAccount, artist1Account, artist2Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).to.emit(eventsContract, "NewBacalhauJobSubmitted")

      const events = await eventsContract.queryFilter(eventsContract.filters.NewBacalhauJobSubmitted())
      expect(events.length).to.equal(1)
      const args = events[0].args.job
      expect(args.requestor).to.equal(artistContract.address)
      expect(args.resultType).to.equal(0)
      expect(args.id).to.equal(BigNumber.from(0))
      expect(args.spec).to.equal(`{"Engine": "docker","Verifier": "noop","Publisher": "estuary","Docker": {"Image": "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1","Entrypoint": ["python", "main.py", "--o", "./outputs", "--p", "hello world in the style of artist1"]},"Resources": {"GPU": "1"},"Outputs": [{"Name": "outputs", "Path": "/outputs"}],"Deal": {"Concurrency": 1}}`)
      
    })

  })

})
