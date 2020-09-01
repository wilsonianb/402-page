import { FC, useEffect, useState } from 'react'
import { useMonetizationCounter } from 'react-web-monetization'

import { ProgressBar } from './ProgressBar'

interface WebMonetizationStatusProps {
  balanceId: string
  receiptVerifierUri: string
  requiredBalance: number
  redirectURI: string
}

export const WebMonetizationStatus: FC<WebMonetizationStatusProps> = (
  props: WebMonetizationStatusProps
) => {
  const { receipt } = useMonetizationCounter()
  const [status, setStatus] = useState(
    <div>
      <h1>402 Payment Required</h1>
      <hr />
    </div>
  )
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (receipt !== null && props.receiptVerifierUri && props.balanceId) {
      const submitReceipt = async (): Promise<void> => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${props.balanceId}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (!done && res.ok && props.requiredBalance) {
          const balance = parseInt(await res.text())
          setStatus(
            <div>
              <h1>Receiving payment...</h1>
              <hr style={{ position: 'relative', zIndex: 1 }} />
              <ProgressBar
                style={{ position: 'relative', top: '-8px' }}
                value={Math.min((100 * balance) / props.requiredBalance, 100)}
              />
            </div>
          )
          if (balance >= props.requiredBalance) {
            setDone(true)
            if (props.redirectURI) {
              window.location.replace(props.redirectURI)
            } else {
              window.location.reload(true)
            }
          }
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  return status
}
