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
  
  const getAccounts = async () => {
    const [owner, customerAccount, artist1Account, artist2Account, other] = await ethers.getSigners()
    return {
      owner,
      customerAccount,
      artist1Account,
      artist2Account,
      other,
    }

  }
  const getDeployContracts = ({
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    async function deployContracts() {
      const {owner, customerAccount, artist1Account, artist2Account, other} = await getAccounts()
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
      await expect(eventsContract.setAuthorizedContract(artistContract.address)).not.to.be.reverted
      return { eventsContract, artistContract, owner, customerAccount, artist1Account, artist2Account, other }
    }
    return deployContracts
  }

  const deployAndPostImage = ({
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION, 
  } = {}) => {
    const deployer = getDeployContracts({imageCost, imageCommission})
    async function deployContractsAndPostImage() {
      const ret = await deployer()
      const { artistContract, customerAccount, artist1Account } = ret
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).not.to.be.reverted
      return ret
    }
    return deployContractsAndPostImage
  }

  const deployAndReturnImage = ({
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    const deployer = deployAndPostImage({imageCost, imageCommission})
    async function deployContractsAndReturnImage() {
      const ret = await deployer()
      const { eventsContract, artistContract, owner } = ret
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).not.to.be.reverted
      return ret
    }
    return deployContractsAndReturnImage
  }

  const deployAndErrorImage = ({
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    const deployer = deployAndPostImage({imageCost, imageCommission})
    async function deployContractsAndReturnImage() {
      const ret = await deployer()
      const { eventsContract, artistContract, owner } = ret
      await expect(eventsContract.connect(owner).returnBacalhauError(
        artistContract.address,
        BigNumber.from(1),
        'I AM ERROR',
      )).not.to.be.reverted
      return ret
    }
    return deployContractsAndReturnImage
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
        'artist commission must be less than or equal to image cost'
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
      const { eventsContract, artistContract, customerAccount, artist1Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).to.emit(eventsContract, "NewBacalhauJobSubmitted")
      const events = await eventsContract.queryFilter(eventsContract.filters.NewBacalhauJobSubmitted())
      expect(events.length).to.equal(1)
      const args = events[0].args.job
      expect(args.requestor).to.equal(artistContract.address)
      expect(args.resultType).to.equal(0)
      expect(args.id).to.equal(BigNumber.from(1))
      expect(args.spec).to.equal(`{"Engine": "docker","Verifier": "noop","Publisher": "estuary","Docker": {"Image": "ghcr.io/bacalhau-project/examples/stable-diffusion-gpu:0.0.1","Entrypoint": ["python", "main.py", "--o", "./outputs", "--p", "hello world in the style of artist1"]},"Resources": {"GPU": "1"},"Outputs": [{"Name": "outputs", "Path": "/outputs"}],"Deal": {"Concurrency": 1}}`)      
    })

    it("Should be able to read the image", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndPostImage())
      expect(await artistContract.getImageIDs()).to.deep.equal([BigNumber.from(1)])
      const image = await artistContract.getImage(BigNumber.from(1))
      expect(image.customer).to.equal(customerAccount.address)
      expect(image.artist).to.equal('artist1')
      expect(image.prompt).to.equal('hello world in the style of artist1')
      expect(image.ipfsResult).to.equal('')
      expect(image.errorMessage).to.equal('')
      expect(image.isComplete).to.equal(false)
      expect(image.isCancelled).to.equal(false)
    })

    it("Should emit BacalhauJobResultsReturned", async function () {
      const { owner, eventsContract, artistContract } = await loadFixture(deployAndPostImage())
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).to.emit(eventsContract, "BacalhauJobResultsReturned")
      const events = await eventsContract.queryFilter(eventsContract.filters.BacalhauJobResultsReturned())
      expect(events.length).to.equal(1)
      const args = events[0].args.result
      expect(args.requestor).to.equal(artistContract.address)
      expect(args.id).to.equal(BigNumber.from(1))
      expect(args.success).to.equal(true)
      expect(args.result).to.equal('I AM RESULT')
      expect(args.resultType).to.equal(BigNumber.from(0))
    })

    it("Should emit ImageGenerated", async function () {
      const { owner, eventsContract, artistContract, customerAccount } = await loadFixture(deployAndPostImage())
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).to.emit(artistContract, "ImageGenerated")
      const events = await artistContract.queryFilter(artistContract.filters.ImageGenerated())
      expect(events.length).to.equal(1)
      const args = events[0].args.image
      expect(args.id).to.equal(BigNumber.from(1))
      expect(args.customer).to.equal(customerAccount.address)
      expect(args.artist).to.equal('artist1')
      expect(args.prompt).to.equal('hello world in the style of artist1')
      expect(args.ipfsResult).to.equal('I AM RESULT')
      expect(args.errorMessage).to.equal('')
      expect(args.isComplete).to.equal(true)
      expect(args.isCancelled).to.equal(false)
    })

    it("Should have the results", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndReturnImage())
      const image = await artistContract.getImage(BigNumber.from(1))
      expect(image.id).to.equal(BigNumber.from(1))
      expect(image.customer).to.equal(customerAccount.address)
      expect(image.artist).to.equal('artist1')
      expect(image.prompt).to.equal('hello world in the style of artist1')
      expect(image.ipfsResult).to.equal('I AM RESULT')
      expect(image.errorMessage).to.equal('')
      expect(image.isComplete).to.equal(true)
      expect(image.isCancelled).to.equal(false)
    })

    it("Should payout when we trigger fulfilled", async function () {
      const { artistContract, artist1Account, artist2Account } = await loadFixture(deployAndReturnImage())
      const artistBeforeWithdraw = await artistContract.getArtist('artist1')
      expect(artistBeforeWithdraw.escrow).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistBeforeWithdraw.revenue).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistBeforeWithdraw.numJobsRun).to.equal(BigNumber.from(1))
      await expect(artistContract.connect(artist1Account).artistWithdraw()).to.changeEtherBalances(
        [artist1Account],
        [DEFAULT_IMAGE_COMMISSION],
      );
      const artistAfterWithdraw = await artistContract.getArtist('artist1')
      expect(artistAfterWithdraw.escrow).to.equal(0)
      expect(artistAfterWithdraw.revenue).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistAfterWithdraw.numJobsRun).to.equal(BigNumber.from(1))
      await expect(artistContract.connect(artist1Account).artistWithdraw()).to.be.revertedWith(
        'artist does not have any money to withdraw'
      )
      await expect(artistContract.connect(artist2Account).artistWithdraw()).to.be.revertedWith(
        'artist does not exist'
      )
    })

    it("Should allow the admin to withdraw", async function () {
      const { artistContract, owner, artist1Account, other } = await loadFixture(deployAndReturnImage())
      await expect(artistContract.connect(artist1Account).adminWithdraw(other.address)).to.be.reverted
      await expect(artistContract.connect(owner).adminWithdraw(other.address)).to.changeEtherBalances(
        [other],
        [DEFAULT_IMAGE_COST.sub(DEFAULT_IMAGE_COMMISSION)],
      );
    })

    it("Should refund when we trigger cancelled", async function () {
      const { artistContract, customerAccount, eventsContract, owner } = await loadFixture(deployAndPostImage())
      const balanceBefore = await ethers.provider.getBalance(customerAccount.address)
      await expect(eventsContract.connect(owner).returnBacalhauError(
        artistContract.address,
        BigNumber.from(1),
        'I AM ERROR',
      )).not.to.be.reverted
      const balanceAfter = await ethers.provider.getBalance(customerAccount.address)
      expect(balanceAfter).to.equal(balanceBefore.add(DEFAULT_IMAGE_COST))
    })

    it("Should not allow to trigger fulfilled a second time", async function () {
      const { eventsContract, artistContract, owner } = await loadFixture(deployAndReturnImage())
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).to.be.revertedWith(
        'image already complete'
      )
    })

    it("Should not allow to trigger fulfilled if cancelled", async function () {
      const { eventsContract, artistContract, owner } = await loadFixture(deployAndErrorImage())
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).to.be.revertedWith(
        'image was cancalled'
      )
    })

    it("Should not allow to trigger cancelled a second time", async function () {
      const { eventsContract, artistContract, owner } = await loadFixture(deployAndErrorImage())
      await expect(eventsContract.connect(owner).returnBacalhauError(
        artistContract.address,
        BigNumber.from(1),
        'I AM ERROR',
      )).to.be.revertedWith(
        'image was cancalled'
      )
      
    })

    it("Should not allow to trigger cancelled if fullfiled", async function () {
      const { eventsContract, artistContract, owner } = await loadFixture(deployAndReturnImage())
      await expect(eventsContract.connect(owner).returnBacalhauError(
        artistContract.address,
        BigNumber.from(1),
        'I AM ERROR',
      )).to.be.revertedWith(
        'image already complete'
      )
    })

  })

  describe("Price", function () {
    it("Should allow the price to be changed", async function () {
      const { artistContract } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('101'))).to.be.revertedWith(
        'artist commission must be less than or equal to image cost'
      )
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      expect(await artistContract.getImageCost()).to.equal(BigNumber.from('100'))
      expect(await artistContract.getArtistCommission()).to.equal(BigNumber.from('20'))
    })

    it("Should allow the price to be reset to defaults", async function () {
      const { artistContract } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.updateCost(BigNumber.from('0'), BigNumber.from('0'))).not.to.be.reverted
      expect(await artistContract.getImageCost()).to.equal(DEFAULT_IMAGE_COST)
      expect(await artistContract.getArtistCommission()).to.equal(DEFAULT_IMAGE_COMMISSION)
    })

    it("Should allow the price to be changed and handle under payments", async function () {
      const { artistContract, customerAccount, artist1Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: BigNumber.from('99'),
      })).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
    })

    it("Should allow the price to be changed and handle over payments", async function () {
      const { artistContract, customerAccount, artist1Account } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: BigNumber.from('200'),
      })).to.changeEtherBalances(
        [customerAccount],
        [BigNumber.from('-100')],
      );
    })

    it("Should payout when we trigger fulfilled", async function () {
      const { artistContract, eventsContract, customerAccount, artist1Account, owner, other } = await loadFixture(getDeployContracts())
      await expect(artistContract.updateCost(BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.updateArtist('artist1', artist1Account.address, '123')).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).StableDiffusion('artist1', 'hello world', {
        value: BigNumber.from('100'),
      })).not.to.reverted;
      await expect(eventsContract.connect(owner).returnBacalhauResults(
        artistContract.address,
        BigNumber.from(1),
        BigNumber.from(0),
        'I AM RESULT',
      )).not.to.be.reverted;
      const artistBeforeWithdraw = await artistContract.getArtist('artist1')
      expect(artistBeforeWithdraw.escrow).to.equal(BigNumber.from('20'))
      expect(artistBeforeWithdraw.revenue).to.equal(BigNumber.from('20'))
      await expect(artistContract.connect(artist1Account).artistWithdraw()).to.changeEtherBalances(
        [artist1Account],
        [BigNumber.from('20')],
      );
      const artistAfterWithdraw = await artistContract.getArtist('artist1')
      expect(artistAfterWithdraw.escrow).to.equal(0)
      expect(artistAfterWithdraw.revenue).to.equal(BigNumber.from('20'))
    })

  })

})
