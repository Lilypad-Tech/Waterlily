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
echo "WALLET_PRIVATE_KEY=xxx\n" > .env
npx hardhat --network filecoinHyperspace run scripts/deploy.ts
```

NOTE: when the contracts are compiled - we copy the ABI to the frontend - so you should re-deploy the frontend.

(but the contract address just changed anyway so there are bigger reasons to have the re-deploy the frontend :-)

You will see something like:

```
LilypadEvents deploying....
LilypadEvents deployed to  0x5552F88C4dA717b61f6018408a0B3a32D380e06e
ArtistAttribution deployed to 0xB5d1E9b8e9a0C0F11EdE5390703d966Ae8b3e09b
LilypadEvents set authorized contract to:  0xB5d1E9b8e9a0C0F11EdE5390703d966Ae8b3e09b
```

Open the `hardhat/.env` file and copy the address for the events contract and artist contract to:

 * `CONTRACT_ADDRESS` = events contract (e.g. `0x5552F88C4dA717b61f6018408a0B3a32D380e06e`)
 * `DEPLOYED_CONTRACT_ADDRESS` = events contract (e.g. `0x5552F88C4dA717b61f6018408a0B3a32D380e06e`)
 * `ARTIST_CONTRACT_ADDRESS` = events contract (e.g. `0xB5d1E9b8e9a0C0F11EdE5390703d966Ae8b3e09b`)

## adding/updating artists

Then we need to add artists:

```bash
cd hardhat
source .env
export ARTIST=artist1
export ADDRESS='0x71bE63f3384f5fb98995898A86B02Fb2426c5788'
export DOCKER_IMAGE='algoveraai/sdprojectv2:mckhallstyle'
export META='apples oranges'
npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
```

## listing artists

```bash
cd hardhat
source .env
npx hardhat --network filecoinHyperspace run scripts/listArtists.ts
```

## test generating an image

Then we can generate an image:

```bash
cd hardhat
source .env
export ARTIST=artist1
export PROMPT='an orange on the moon'
npx hardhat --network filecoinHyperspace run scripts/generateImage.ts
```

## listing images

```bash
cd hardhat
source .env
npx hardhat --network filecoinHyperspace run scripts/listImages.ts
```

## changing the price

```bash
cd hardhat
source .env
export IMAGE_COST=100
export ARTIST_COMMISSION=20
npx hardhat --network filecoinHyperspace run scripts/changePrice.ts
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

## commands to actually deploy prod

The most recent set of commands for the prod contract:

```bash
cd hardhat
source .env
npx hardhat compile
npx hardhat --network filecoinHyperspace run scripts/deploy.ts
IMAGE_COST=100 ARTIST_COMMISSION=20 \
npx hardhat --network filecoinHyperspace run scripts/changePrice.ts
# this wallet is a test wallet that Ally controls - we can change that later
ARTIST=mckhallstyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 DOCKER_IMAGE=algoveraai/sdprojectv2:mckhallstyle npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
```

## commands to test lilypad end to end

```bash
cd hardhat
source .env
cd ../../lilypad
export LOG_LEVEL=debug
go run .
# lilypad is now running against the deployed contract and pointing at the custom bacalhau cluster
```

Then in another window to write a job tx:

```bash
cd hardhat
source .env
ARTIST=mckhallstyle PROMPT='an orange' npx hardhat --network filecoinHyperspace run scripts/generateImage.ts
```

## deploy image store

We host the image store that jobs upload their images to.

This is currently living on Kai's k8s cluster (we ran out of time).

Ideally we would move this to run on the same VM as the bridge golang process.

In the meantime - here is how it was deployed:

```bash
kubectl create ns waterlily-filestore
kubectl apply -f filestore-deploy/01-pv.yaml
kubectl apply -f filestore-deploy/02-pvc.yaml
kubectl apply -f filestore-deploy/03-service.yaml
kubectl apply -f filestore-deploy/ingress.yaml
cd filestore
export CI_COMMIT_SHA=$(git rev-parse HEAD)
export FILESTORE_IMAGE=gcr.io/webkit-servers/waterlily-filestore:$CI_COMMIT_SHA
docker build -t $FILESTORE_IMAGE filestore
docker push $FILESTORE_IMAGE
cat filestore-deploy/04-deployment.yaml | envsubst | kubectl apply -f -
```
