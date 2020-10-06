import { GetServerSideProps, NextPage } from 'next'
import getConfig from 'next/config'

import { Head } from '../components/Head'
import { WebMonetizationStatus } from '../components/WebMonetizationStatus'

const { publicRuntimeConfig } = getConfig()

interface IndexProps {
  paymentPointer: string
  balanceId: string
  receiptVerifierUri: string
  requiredAmount: number
  requiredBalance: number
  redirectURI: string
}

const IndexPage: NextPage<IndexProps> = (props: IndexProps) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Head paymentPointer={props.paymentPointer} />
      <WebMonetizationStatus
        balanceId={props.balanceId}
        receiptVerifierUri={props.receiptVerifierUri}
        requiredAmount={props.requiredAmount}
        requiredBalance={props.requiredBalance}
        redirectURI={props.redirectURI}
      />
      <a href='https://webmonetization.org'>webmonetization.org</a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const props = {
    ...publicRuntimeConfig
  }

  if (!props.balanceId) {
    if (props.balanceIdHeader) {
      const header = ctx.req.headers[
        props.balanceIdHeader.toLowerCase()
      ] as string
      if (!header) {
        throw `no ${props.balanceIdHeader} header`
      }
      if (props.balanceIdRegex) {
        const re = new RegExp(props.balanceIdRegex)
        const match = header.match(re)
        if (match && match.groups && match.groups['id']) {
          props.balanceId = match.groups['id']
        } else {
          throw `no match for $props.balanceIdRegex in ${header}`
        }
      } else {
        props.balanceId = header
      }
    }
  } else if (props.balanceIdHeader) {
    throw 'BALANCE_ID and BALANCE_ID_HEADER are mutually exclusive'
  } else if (props.balanceIdRegex) {
    throw 'BALANCE_ID_REGEX requires BALANCE_ID_HEADER'
  }

  if (props.balanceId && !props.receiptVerifierUri) {
    throw 'BALANCE_ID* requires RECEIPT_VERIFIER_URI'
  }

  if (props.requiredBalance && !props.balanceId) {
    throw 'REQUIRED_BALANCE requires BALANCE_ID*'
  }

  if (props.requiredAmount && !props.receiptVerifierUri) {
    throw 'REQUIRED_AMOUNT requires RECEIPT_VERIFIER_URI'
  }

  if (props.requiredAmount && props.requiredBalance) {
    throw 'REQUIRED_AMOUNT and REQUIRED_BALANCE are mutually exclusive'
  }

  if (props.redirectURI && !props.requiredAmount && !props.requiredBalance) {
    throw 'REDIRECT_URI requires REQUIRED_AMOUNT or REQUIRED_BALANCE'
  }

  return { props }
}

export default IndexPage
