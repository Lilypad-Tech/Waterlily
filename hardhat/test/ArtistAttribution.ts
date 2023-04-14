import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import type { ArtistAttribution } from '../typechain-types/contracts/ArtistAttribution';

const ARTIST_ID = 'artist1'
const BASE_COST = BigNumber.from('650000000000000')
const DEFAULT_ARTIST_COST = BASE_COST.mul(BigNumber.from('2500'))
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
    artistCost = DEFAULT_ARTIST_COST,
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    async function deployContracts() {
      const {owner, customerAccount, artist1Account, artist2Account, other} = await getAccounts()
      const ArtistAttributionFactory = await ethers.getContractFactory("ArtistAttribution")
      const artistContract = await ArtistAttributionFactory.deploy(
        artistCost,
        imageCost,
        imageCommission,
      )
      await artistContract.deployed()
      return { artistContract, owner, customerAccount, artist1Account, artist2Account, other }
    }
    return deployContracts
  }

  const deployAndTrainArtist = ({
    artistCost = DEFAULT_ARTIST_COST,
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION, 
  } = {}) => {
    const deployer = getDeployContracts({artistCost, imageCost, imageCommission})
    async function deployContractsAndTrainArtist() {
      const ret = await deployer()
      const { owner, artistContract, artist1Account } = ret

      await expect(artistContract.connect(artist1Account).CreateArtist(ARTIST_ID, '123', {
        value: DEFAULT_ARTIST_COST,
      })).not.to.be.reverted

      await expect(artistContract.connect(owner).ArtistComplete(ARTIST_ID)).not.to.be.reverted
      return ret
    }
    return deployContractsAndTrainArtist
  }

  const deployAndPostImage = ({
    artistCost = DEFAULT_ARTIST_COST,
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION, 
  } = {}) => {
    const deployer = deployAndTrainArtist({artistCost, imageCost, imageCommission})
    async function deployContractsAndPostImage() {
      const ret = await deployer()
      const { artistContract, customerAccount } = ret
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).not.to.be.reverted
      return ret
    }
    return deployContractsAndPostImage
  }

  const deployAndReturnImage = ({
    artistCost = DEFAULT_ARTIST_COST,
    imageCost = DEFAULT_IMAGE_COST,
    imageCommission = DEFAULT_IMAGE_COMMISSION,
  } = {}) => {
    const deployer = deployAndPostImage({artistCost, imageCost, imageCommission})
    async function deployContractsAndReturnImage() {
      const ret = await deployer()
      const { artistContract, owner } = ret
      await expect(artistContract.connect(owner).ImageComplete(
        BigNumber.from(1),
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
      const { artistContract, owner } = ret
      await expect(artistContract.connect(owner).ImageCancelled(
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
      const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
      await expect(ArtistAttribution.deploy(
        DEFAULT_ARTIST_COST,
        DEFAULT_IMAGE_COST,
        DEFAULT_IMAGE_COST.add(BigNumber.from('1')),
      )).to.be.revertedWith(
        'artist commission must be less than or equal to image cost'
      )
    })
  })
  
  describe("Image", function () {
    it("Should revert when the artist ID is wrong", async function () {
      const { artistContract, customerAccount } = await loadFixture(getDeployContracts())
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world')).to.be.revertedWith(
        'artist does not exist'
      )
    })

    it("Should revert when not enough FIL has been sent", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndTrainArtist())
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world')).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: DEFAULT_IMAGE_COST.sub(BigNumber.from('1')),
      })).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).not.to.be.reverted
    })

    it("Should return the image ID", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndTrainArtist())
      const tx = await artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })
      const txReceipt = await tx.wait()
      const [jobEvent] = txReceipt.logs.map((log) => artistContract.interface.parseLog(log))
      const [job] = jobEvent.args
      const [id] = job
      expect(id).to.equal(BigNumber.from(1))
    })

    it("Should emit an event from the events contract", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndTrainArtist())
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: DEFAULT_IMAGE_COST,
      })).to.emit(artistContract, "EventImageCreated")
      const events = await artistContract.queryFilter(artistContract.filters.EventImageCreated())
      expect(events.length).to.equal(1)
      const [id, customer, artist, prompt] = events[0].args[0]
      expect(id).to.equal(BigNumber.from(1))
      expect(customer).to.equal(customerAccount.address)
      expect(artist).to.equal(ARTIST_ID)
      expect(prompt).to.equal('hello world')
    })

    it("Should be able to read the image", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndPostImage())
      expect(await artistContract.getImageIDs()).to.deep.equal([BigNumber.from(1)])
      const image = await artistContract.getImage(BigNumber.from(1))
      expect(image.id).to.equal(BigNumber.from(1))
      expect(image.customer).to.equal(customerAccount.address)
      expect(image.artist).to.equal(ARTIST_ID)
      expect(image.prompt).to.equal('hello world')
      expect(image.ipfsResult).to.equal('')
      expect(image.errorMessage).to.equal('')
      expect(image.isComplete).to.equal(false)
      expect(image.isCancelled).to.equal(false)
    })

    it("Should have the image id in our customer specific list", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndPostImage())
      expect(await artistContract.getCustomerImages(customerAccount.address)).to.deep.equal([BigNumber.from(1)])
    })

    it("Should emit EventImageComplete", async function () {
      const { owner, artistContract, customerAccount } = await loadFixture(deployAndPostImage())
      await expect(artistContract.connect(owner).ImageComplete(
        BigNumber.from(1),
        'I AM RESULT',
      )).to.emit(artistContract, "EventImageComplete")
      const events = await artistContract.queryFilter(artistContract.filters.EventImageComplete())
      expect(events.length).to.equal(1)
      const image = events[0].args[0]
      expect(image.id).to.equal(BigNumber.from(1))
      expect(image.customer).to.equal(customerAccount.address)
      expect(image.artist).to.equal(ARTIST_ID)
      expect(image.prompt).to.equal('hello world')
      expect(image.ipfsResult).to.equal('I AM RESULT',)
      expect(image.errorMessage).to.equal('')
      expect(image.isComplete).to.equal(true)
      expect(image.isCancelled).to.equal(false)
    })

    it("Should have the results", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndReturnImage())
      const image = await artistContract.getImage(BigNumber.from(1))
      expect(image.id).to.equal(BigNumber.from(1))
      expect(image.customer).to.equal(customerAccount.address)
      expect(image.artist).to.equal(ARTIST_ID)
      expect(image.prompt).to.equal('hello world')
      expect(image.ipfsResult).to.equal('I AM RESULT')
      expect(image.errorMessage).to.equal('')
      expect(image.isComplete).to.equal(true)
      expect(image.isCancelled).to.equal(false)
    })

    it("Should payout when we trigger fulfilled", async function () {
      const { artistContract, artist1Account, artist2Account } = await loadFixture(deployAndReturnImage())
      const artistBeforeWithdraw = await artistContract.getArtist(ARTIST_ID)
      expect(artistBeforeWithdraw.escrow).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistBeforeWithdraw.revenue).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistBeforeWithdraw.numJobsRun).to.equal(BigNumber.from(1))
      await expect(artistContract.connect(artist2Account).artistWithdraw(ARTIST_ID)).to.be.revertedWith(
        'only the artist\'s wallet can call this function'
      )
      await expect(artistContract.connect(artist1Account).artistWithdraw(ARTIST_ID)).to.changeEtherBalances(
        [artist1Account],
        [DEFAULT_IMAGE_COMMISSION],
      );
      const artistAfterWithdraw = await artistContract.getArtist(ARTIST_ID)
      expect(artistAfterWithdraw.escrow).to.equal(0)
      expect(artistAfterWithdraw.revenue).to.equal(DEFAULT_IMAGE_COMMISSION)
      expect(artistAfterWithdraw.numJobsRun).to.equal(BigNumber.from(1))
      await expect(artistContract.connect(artist1Account).artistWithdraw(ARTIST_ID)).to.be.revertedWith(
        'artist does not have any money to withdraw'
      )
      await expect(artistContract.connect(artist2Account).artistWithdraw(ARTIST_ID + 'other')).to.be.revertedWith(
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
      const { artistContract, customerAccount, owner } = await loadFixture(deployAndPostImage())
      const balanceBefore = await ethers.provider.getBalance(customerAccount.address)
      await expect(artistContract.connect(owner).ImageCancelled(
        BigNumber.from(1),
        'I AM ERROR',
      )).not.to.be.reverted
      const balanceAfter = await ethers.provider.getBalance(customerAccount.address)
      expect(balanceAfter).to.equal(balanceBefore.add(DEFAULT_IMAGE_COST))
    })

    it("Should not allow to trigger fulfilled a second time", async function () {
      const { artistContract, owner } = await loadFixture(deployAndReturnImage())
      await expect(artistContract.connect(owner).ImageComplete(
        BigNumber.from(1),
        'I AM RESULT',
      )).to.be.revertedWith(
        'image already complete'
      )
    })

    it("Should not allow to trigger fulfilled if cancelled", async function () {
      const { artistContract, owner } = await loadFixture(deployAndErrorImage())
      await expect(artistContract.connect(owner).ImageComplete(
        BigNumber.from(1),
        'I AM RESULT',
      )).to.be.revertedWith(
        'image was cancalled'
      )
    })

    it("Should not allow to trigger cancelled a second time", async function () {
      const { artistContract, owner } = await loadFixture(deployAndErrorImage())
      await expect(artistContract.connect(owner).ImageCancelled(
        BigNumber.from(1),
        'I AM ERROR',
      )).to.be.revertedWith(
        'image was cancalled'
      )
      
    })

    it("Should not allow to trigger cancelled if fullfiled", async function () {
      const { artistContract, owner } = await loadFixture(deployAndReturnImage())
      await expect(artistContract.connect(owner).ImageCancelled(
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
      await expect(artistContract.updateCost(BigNumber.from('200'), BigNumber.from('100'), BigNumber.from('101'))).to.be.revertedWith(
        'artist commission must be less than or equal to image cost'
      )
      await expect(artistContract.updateCost(BigNumber.from('200'), BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      expect(await artistContract.getArtistCost()).to.equal(BigNumber.from('200'))
      expect(await artistContract.getImageCost()).to.equal(BigNumber.from('100'))
      expect(await artistContract.getArtistCommission()).to.equal(BigNumber.from('20'))
    })

    it("Should allow the price to be changed and handle under payments", async function () {
      const { artistContract, customerAccount } = await loadFixture(deployAndTrainArtist())
      await expect(artistContract.updateCost(BigNumber.from('200'), BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: BigNumber.from('99'),
      })).to.be.revertedWith(
        'not enough FIL sent to pay for image'
      )
    })

    it("Should allow the price to be changed and handle over payments", async function () {
      const { artistContract, customerAccount, artist1Account } = await loadFixture(deployAndTrainArtist())
      await expect(artistContract.updateCost(BigNumber.from('200'), BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: BigNumber.from('200'),
      })).to.changeEtherBalances(
        [customerAccount],
        [BigNumber.from('-100')],
      );
    })

    it("Should payout when we trigger fulfilled", async function () {
      const { artistContract, customerAccount, artist1Account, owner, other } = await loadFixture(deployAndTrainArtist())
      await expect(artistContract.updateCost(BigNumber.from('200'), BigNumber.from('100'), BigNumber.from('20'))).not.to.be.reverted
      await expect(artistContract.connect(customerAccount).CreateImage(ARTIST_ID, 'hello world', {
        value: BigNumber.from('100'),
      })).not.to.reverted;
      await expect(artistContract.connect(owner).ImageComplete(
        BigNumber.from(1),
        'I AM RESULT',
      )).not.to.be.reverted;
      const artistBeforeWithdraw = await artistContract.getArtist(ARTIST_ID)
      expect(artistBeforeWithdraw.escrow).to.equal(BigNumber.from('20'))
      expect(artistBeforeWithdraw.revenue).to.equal(BigNumber.from('20'))
      await expect(artistContract.connect(artist1Account).artistWithdraw(ARTIST_ID)).to.changeEtherBalances(
        [artist1Account],
        [BigNumber.from('20')],
      );
      const artistAfterWithdraw = await artistContract.getArtist(ARTIST_ID)
      expect(artistAfterWithdraw.escrow).to.equal(0)
      expect(artistAfterWithdraw.revenue).to.equal(BigNumber.from('20'))
    })

  })

})
