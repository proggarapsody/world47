import React, { useState } from 'react'
import { Button, Dropdown, Spinner, Alert } from 'react-bootstrap'
import { useWallet } from '../hooks/useWallet'

const WalletButton: React.FC = () => {
  const {
    address,
    balance,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    isMetaMaskInstalled,
  } = useWallet()
  const [showDropdown, setShowDropdown] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const onConnect = async () => {
    await connect()
  }

  const onMetamaskNavigate = () => {
    window.open('https://metamask.io/download.html', '_blank')
  }

  const handleClick = () => {
    if (isMetaMaskInstalled) {
      onConnect()
    } else {
      onMetamaskNavigate()
    }
  }
  
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowDropdown(false)
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-end">
        <Alert
          variant="danger"
          className="mb-2 p-2"
          style={{ fontSize: '0.8rem' }}
        >
          {error}
        </Alert>

        <Button
          variant="outline-danger"
          size="sm"
          onClick={onConnect}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Retry'}
        </Button>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <Dropdown show={showDropdown} onToggle={setShowDropdown}>
        <Dropdown.Toggle
          as={Button}
          variant="success"
          className="d-flex align-items-center me-2"
          size="sm"
          style={{ minWidth: '120px' }}
        >
          <i className="fa-solid fa-wallet me-2"></i>
          {formatAddress(address)}
        </Dropdown.Toggle>

        <Dropdown.Menu
          align="end"
          className="p-3"
          style={{ minWidth: '250px' }}
        >
          <div className="text-center mb-3">
            <b>Address:</b> {formatAddress(address)}
          </div>

          {balance && (
            <div className="mb-3 p-2 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">Balance:</span>
                <span className="fw-bold">
                  {parseFloat(balance).toFixed(4)} ETH
                </span>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleCopyAddress}
            >
              <i className="fa-solid fa-copy me-1"></i>
              Copy Address
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDisconnect}
            >
              <i className="fa-solid fa-sign-out-alt me-1"></i>
              Disconnect
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <Button
      variant="primary"
      onClick={handleClick}
      disabled={isLoading}
      className="d-flex align-items-center me-2"
      size="sm"
      style={{ minWidth: '120px' }}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="me-2" />
          Connecting...
        </>
      ) : (
        <>
          <i className="fa-solid fa-wallet me-2"></i>
          Connect Wallet
        </>
      )}
    </Button>
  )
}

export default WalletButton
