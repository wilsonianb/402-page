import { FC, useEffect, useState } from 'react'
import { useMonetizationCounter } from 'react-web-monetization'

import { ProgressBar } from './ProgressBar'

interface WebMonetizationStatusProps {
  balanceId: string
  receiptVerifierUri: string
  requiredAmount: number
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
  const [totalReceived, setTotalReceived] = useState(0)

  useEffect(() => {
    if (receipt !== null && props.receiptVerifierUri && props.balanceId) {
      const submitReceipt = async (): Promise<void> => {
        const url = props.balanceId
          ? `${props.receiptVerifierUri}/balances/${props.balanceId}:creditReceipt`
          : `${props.receiptVerifierUri}/receipts`
        const res = await fetch(url, {
          method: 'POST',
          body: receipt
        })
        if (
          !done &&
          res.ok &&
          (props.requiredAmount || props.requiredBalance)
        ) {
          const value =
            parseInt(await res.text()) +
            (props.requiredAmount ? totalReceived : 0)
          const target = props.requiredAmount || props.requiredBalance
          setStatus(
            <div>
              <h1>Receiving payment...</h1>
              <hr style={{ position: 'relative', zIndex: 1 }} />
              <ProgressBar
                style={{ position: 'relative', top: '-8px' }}
                value={Math.min((100 * value) / target, 100)}
              />
            </div>
          )
          if (value >= target) {
            setDone(true)
            if (props.redirectURI) {
              window.location.replace(props.redirectURI)
            } else {
              window.location.reload(true)
            }
          } else if (props.requiredAmount) {
            setTotalReceived(value)
          }
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  return status
}
