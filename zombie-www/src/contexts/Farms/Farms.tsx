import React, { useCallback, useEffect, useState } from 'react'

import { Contract } from 'web3-eth-contract'

import { yam as yamAddress } from '../../constants/tokenAddresses'
import useYam from '../../hooks/useYam'
import { getPoolContracts } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'

const NAME_FOR_POOL: { [key: string]: string } = {
  // bsd95_pool: 'Bal_Shrimp_Dai_95',
  // bsd80_pool: 'Bal_Shrimp_Dai_80',
  // yfi_pool: 'YFI Farm',
  // eth_pool: 'Weth Homestead',
  // cream_pool: 'Modgie streams',
  // comp_pool: 'Compounding Hills',
  dice_pool: 'Safe Haven',
  uni_pool: 'WETH_SHRIMP_UNI_LP',
  shrimp_pool: 'Undead shrimps'
  // taco_pool: 'Taco Tuesday'
}

const ICON_FOR_POOL: { [key: string]: string } = {
  // bsd95_pool: '⛵️',
  // bsd80_pool: '🌊',
  // yfi_pool: '🐋',
  // eth_pool: '🌎',
  // cream_pool: '🍦',
  // comp_pool: '💸',
  dice_pool: '🎲',
  uni_pool: '🌈',
  shrimp_pool: '🦐'

  // taco_pool: '🌮',
}

const SORT_FOR_POOL: { [key: string]: number } = {
  // bsd95_pool: 0,
  // bsd80_pool: 1,  
  // taco_pool: 2,
  // yfi_pool: 3,
  // eth_pool: 4,
  // cream_pool: 5,
  // comp_pool: 6,
  dice_pool: 0,
  uni_pool: 1,
  shrimp_pool: 2
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const yam = useYam()

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract} = await getPoolContracts(yam)

    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i]
      const pool = pools[poolKey]
      let tokenKey = poolKey.replace('_pool', '')
      if (tokenKey === 'eth') {
        tokenKey = 'weth'
      }

      //  else if (tokenKey === 'ampl') {
      //   tokenKey = 'ampl_eth_uni_lp'
      // } else if (tokenKey === 'scrv') {
      //   tokenKey = 'scrv_shrimp_uni_lp'
      // }

      // const method = pool.methods[tokenKey]
      try {
        let tokenAddress = ''
        // if (method) {
        //   tokenAddress = await method().call()
        // } 
        
        if (tokenKey === 'dice') {
          tokenAddress = '0xCF67CEd76E8356366291246A9222169F4dBdBe64'
        }

        // if (tokenKey === 'cream') {
        //   tokenAddress = '0x2ba592F78dB6436527729929AAf6c908497cB200'
        // }

        // if (tokenKey === 'comp') {
        //   tokenAddress = '0xc00e94cb662c3520282e6f5717214004a7f26888'
        // }

        // if (tokenKey === 'yfi') {
        //   tokenAddress = '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'
        // }

        // if (tokenKey === 'weth') {
        //   tokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        // }

        if (tokenKey === 'uni') {
          tokenAddress = '0xeba5d22bbeb146392d032a2f74a735d66a32aee4'
        }

        if (tokenKey === 'shrimp') {
          tokenAddress = '0x00D1793D7C3aAE506257Ba985b34C76AaF642557'
        }
        // //Pool 95
        // if (tokenKey === 'bsd95') {
        //   tokenAddress = '0x00D1793D7C3aAE506257Ba985b34C76AaF642557'
        // }
        // //Pool 80
        // if (tokenKey === 'bsd80') {
        //   tokenAddress = '0x00D1793D7C3aAE506257Ba985b34C76AaF642557'
        // }

        
        // alert(tokenAddress);

        farmsArr.push({
          contract: pool,
          name: NAME_FOR_POOL[poolKey],
          depositToken: tokenKey,
          depositTokenAddress: tokenAddress,
          earnToken: 'zombie',
          earnTokenAddress: yamAddress,
          icon: ICON_FOR_POOL[poolKey],
          id: tokenKey,
          sort: SORT_FOR_POOL[poolKey]
        })
      } catch (e) {
        console.log(e)
        alert(e);
      }
    }
    farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)
    setFarms(farmsArr)
  }, [yam, setFarms])

  useEffect(() => {
    if (yam) {
      fetchPools()
    }
  }, [yam, fetchPools])
  
  return (
    <Context.Provider value={{ farms }}>
      {children}
    </Context.Provider>
  )
}

export default Farms