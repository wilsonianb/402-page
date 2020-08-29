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
        if (res.ok && props.requiredBalance) {
          const balance = parseInt(await res.text())
          if (balance >= props.requiredBalance) {
            if (props.redirectURI) {
              window.location.replace(props.redirectURI)
            } else {
              window.location.reload(true)
            }
          } else {
            setStatus(
              <div>
                <h1>Receiving payment...</h1>
                <hr />
                <ProgressBar
                  style={{position: "relative", top: "-10px"}}
                  value={100 * balance / props.requiredBalance}
                />
              </div>
            )
          }
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  return status
}
