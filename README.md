# Challenge token

## Description

I implemented ChallengeToken as an upgreadeable ERC20 token with access control functionality. 
I decided to implement dynamic setting of percentage of ETH the user gets for burning of the token as this allows adjustments. All of the transactions are included in this `README.md` file.

You can find initial smart contract at [./contracts/ChallengeToken.sol](./contracts/ChallengeToken.sol) and the upgraded version at [./contracts/ChallengeTokenV2.sol](./contracts/ChallengeTokenV2.sol).

Tests are included within [./test/challenge_token.js](./test/challenge_token.js) and they cover some of the most important functionalities. If this was a production level project, I would have covered all of the functions, but here I trusted the battle tested OpenZeppelin contracts and focused on custom functionalities.

I [deployed](./migrations/1628284507_deploy_token_and_proxy.js) the token and [upgraded](./migrations/1628290021_upgrade_challenge_token_to_v2.js) it using Truffle migrations.

The transactions were sent via terminal. The tx hashed included below aslo have links to their Etherscan entries.

## Transactions

### Deploy transactions

Initial token cotract deploy: [0xa66c6d1f20ae2d5ff175315ac3b44eba5eff4e2395cf08b4f2a1f2f267020f03](https://kovan.etherscan.io/tx/0xa66c6d1f20ae2d5ff175315ac3b44eba5eff4e2395cf08b4f2a1f2f267020f03)

Proxy contract deploy: [0xdfe6fbae8885e88105a3dc34937277fd6bc88e58d779c486b0526a3a5e695fa3](https://kovan.etherscan.io/tx/0xdfe6fbae8885e88105a3dc34937277fd6bc88e58d779c486b0526a3a5e695fa3)

### Minting

Transaction that minted the token: [0x20806a549777424945c77a245ea96a7f3c58d83fb4f2969f4eec1a71cd3ea2cc](https://kovan.etherscan.io/tx/0x20806a549777424945c77a245ea96a7f3c58d83fb4f2969f4eec1a71cd3ea2cc)

### Upgrade

Transaction that performed the upgrade: [0xc97afbb7c25706596dcec303178929d931daf6b5d21fab893a8da03ae945c083](https://kovan.etherscan.io/tx/0xc97afbb7c25706596dcec303178929d931daf6b5d21fab893a8da03ae945c083)

I also included the ability for owner to set the percentage of ETH the user gets back when burning tokens: [0x731e6a6d35154d4d2660e9d930a3ada376fbfae0da6b12be61515e2762664913](https://kovan.etherscan.io/tx/0x731e6a6d35154d4d2660e9d930a3ada376fbfae0da6b12be61515e2762664913)

### Upgrade kill switch

Transaction that performed the kill of upgradeability: [0x2a79335883505fd0bd620c34ced4f9574eced7fd9abdd72c5acef30815fcae35](https://kovan.etherscan.io/tx/0x2a79335883505fd0bd620c34ced4f9574eced7fd9abdd72c5acef30815fcae35)

### Burn

Transaction that burned token: [0x63e173c319d5fdc29ad8692db6f611e23b3234aeaacf71579ef60515dc7633b5](https://kovan.etherscan.io/tx/0x63e173c319d5fdc29ad8692db6f611e23b3234aeaacf71579ef60515dc7633b5)