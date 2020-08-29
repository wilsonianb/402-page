module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    balanceId: process.env.BALANCE_ID,
    balanceIdHeader: process.env.BALANCE_ID_HEADER,
    balanceIdRegex: process.env.BALANCE_ID_REGEX,
    paymentPointer: process.env.PAYMENT_POINTER,
    receiptVerifierUri: process.env.RECEIPT_VERIFIER_URI,
    redirectURI: process.env.REDIRECT_URI,
    requiredBalance: parseInt(process.env.REQUIRED_BALANCE)
  }
}
