## artist

This is the deployment for the AI-Artist-Attribution project.

We run this as:

 * a vercel app hosting the frontend
 * some smart contracts on FVM
 * a golang process on a google cloud VM
 * a private bacalhau cluster

## deploy smart contracts

```bash
cd hardhat
npm install
npm run compile
npx hardhat --network filecoinHyperspace run scripts/deploy.js
```

NOTE: when the contracts are compiled - we copy the ABI to the frontend - so you should re-deploy the frontend.

(but the contract address just changed anyway so there are bigger reasons to have the re-deploy the frontend :-)

You will see something like:

```
LilypadEvents deploying....                                                                                                                                                                                                                
LilypadEvents deployed to  0xAfc65F7A0130E8966132167B9a527FcD78D71214                                                                                                                                                                      
ArtistAttribution deployed to  0x4cdfb4e91b1B498b8A6FDBD5b62C11D4da1D1d0b                                                                                                                                                                  
LilypadEvents set authorized contract to:  0x4cdfb4e91b1B498b8A6FDBD5b62C11D4da1D1d0b
```

Open the `hardhat/.env` file and copy the address for the events contract and artist contract to:

 * `CONTRACT_ADDRESS` = events contract (e.g. `0xAfc65F7A0130E8966132167B9a527FcD78D71214`)
 * `DEPLOYED_CONTRACT_ADDRESS` = events contract (e.g. `0xAfc65F7A0130E8966132167B9a527FcD78D71214`)
 * `ARTIST_CONTRACT_ADDRESS` = events contract (e.g. `0x4cdfb4e91b1B498b8A6FDBD5b62C11D4da1D1d0b`)

## adding/updating artists

Then we need to add artists:

```bash
cd hardhat
export ARTIST=artist1
export ADDRESS='0x71bE63f3384f5fb98995898A86B02Fb2426c5788'
export META='apples oranges'
npx hardhat --network filecoinHyperspace run scripts/addArtist.js
```

## listing artists

```bash
cd hardhat
npx hardhat --network filecoinHyperspace run scripts/listArtists.js
```

## test generating an image

Then we can generate an image:

```bash
cd hardhat
export ARTIST=artist1
export PROMPT='an orange on the moon'
npx hardhat --network filecoinHyperspace run scripts/generateImage.js
```

## listing images

```bash
cd hardhat
npx hardhat --network filecoinHyperspace run scripts/listImages.js
```

## deploy VM

The VM is on google cloud and managed by terraform:

```bash
cd ops
gcloud auth login
gcloud config set project bacalhau-production
terraform init
terraform apply
```

## deploy new bridge golang

You need to clone https://github.com/bacalhau-project/lilypad at the same level as this project and then:

```bash
(cd ../lilypad && make build)
```

This build the binary - then we run the script:

```bash
cd ops
bash deploy.sh
```
