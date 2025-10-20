import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider, Signer, formatEther } from 'ethers'

interface WalletState {
  address: string | null
  balance: string | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
  isMetaMaskInstalled: boolean
}

interface EIP1193Provider {
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  request: (request: {
    method: string
    params?: Array<unknown>
  }) => Promise<unknown>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      isMetaMask?: boolean
    }
  }
}

export const useWallet = (): UseWalletReturn => {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isLoading: false,
    error: null,
  })

  const [, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)

  const isMetaMaskInstalled = Boolean(
    window.ethereum && window.ethereum.isMetaMask
  )

  const updateBalance = useCallback(async (signer: Signer) => {
    try {
      const balance = await signer.provider?.getBalance(
        await signer.getAddress()
      )
      if (balance) {
        const formattedBalance = formatEther(balance)
        setState((prev) => ({ ...prev, balance: formattedBalance }))
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [])

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      setState((prev) => ({
        ...prev,
        error: 'MetaMask is not installed.',
        isLoading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const accounts = (await window.ethereum!.request({
        method: 'eth_requestAccounts',
      })) as string[]

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const browserProvider = new BrowserProvider(window.ethereum!)
      const walletSigner = await browserProvider.getSigner()
      const address = await walletSigner.getAddress()

      setProvider(browserProvider)
      setSigner(walletSigner)
      setState((prev) => ({
        ...prev,
        address,
        isConnected: true,
        isLoading: false,
        error: null,
      }))

      await updateBalance(walletSigner)
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet'

      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request'
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending'
      } else if (error.message) {
        errorMessage = error.message
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
    }
  }, [updateBalance, isMetaMaskInstalled])

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setState({
      address: null,
      balance: null,
      isConnected: false,
      isLoading: false,
      error: null,
    })
  }, [])

  const refreshBalance = useCallback(async () => {
    if (signer) {
      await updateBalance(signer)
    }
  }, [signer, updateBalance])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (state.isConnected && accounts[0] !== state.address) {
        connect()
      }
    }

    const handleChainChanged = () => {
      if (state.isConnected) {
        connect()
      }
    }

    window.ethereum!.on('accountsChanged', handleAccountsChanged)
    window.ethereum!.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [
    state.isConnected,
    state.address,
    connect,
    disconnect,
    isMetaMaskInstalled,
  ])

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return

      try {
        const accounts = (await window.ethereum.request({
          method: 'eth_accounts',
        })) as string[]

        if (accounts.length > 0) {
          const browserProvider = new BrowserProvider(window.ethereum)
          const walletSigner = await browserProvider.getSigner()
          const address = await walletSigner.getAddress()

          setProvider(browserProvider)
          setSigner(walletSigner)
          setState((prev) => ({
            ...prev,
            address,
            isConnected: true,
            error: null,
          }))

          await updateBalance(walletSigner)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }

    const handleFocus = () => {
      if (isMetaMaskInstalled) {
        checkConnection()
      }
    }

    checkConnection()

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [updateBalance, isMetaMaskInstalled])

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    isMetaMaskInstalled,
  }
}
