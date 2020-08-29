import { FC } from 'react'
import NextHead from 'next/head'

interface HeadProps {
  paymentPointer: string
}

export const Head: FC<HeadProps> = (props: HeadProps) => {
  return (
    <NextHead>
      <title>402 Payment Required</title>
      { props.paymentPointer ? <meta name='monetization' content={props.paymentPointer} /> : <></> }
    </NextHead>
  )
}
