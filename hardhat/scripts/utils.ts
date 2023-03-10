import { BigNumber } from 'ethers'

export const BASE_COST = BigNumber.from('650000000000000')
export const DEFAULT_IMAGE_COST = BASE_COST.mul(BigNumber.from('250'))
export const DEFAULT_IMAGE_COMMISSION = BASE_COST.mul(BigNumber.from('50'))
