## artist

This is the deployment for the AI-Artist-Attribution project.

We run this as:

- a vercel app hosting the frontend
- some smart contracts on FVM
- a golang process on a google cloud VM
- a private bacalhau cluster

## deploy smart contracts

```bash
cd hardhat
npm install
npm run compile
echo "BACALHAU_API_HOST=ai-art-requester.cluster.world" > .env
# NOTE: you need to actaully get the key below
echo "WALLET_PRIVATE_KEY=XXX\n" >> .env
npx hardhat --network filecoinHyperspace run scripts/deploy.ts
```

NOTE: when the contracts are compiled - we copy the ABI to the frontend - so you should re-deploy the frontend.

(but the contract address just changed anyway so there are bigger reasons to have the re-deploy the frontend :-)

You will see something like:

```
LilypadEvents deploying....
LilypadEvents deployed to  0x961F90f5F12CF532E8D0E65F0E79eb25aa949000
ArtistAttribution deployed to 0xC89642668A64A5CeEF51B5dCe4621ACA209b82a6
LilypadEvents set authorized contract to:  0xC89642668A64A5CeEF51B5dCe4621ACA209b82a6
```

Open the `hardhat/.env` file and copy the address for the events contract and artist contract to:

- `CONTRACT_ADDRESS` = events contract (e.g. `0x961F90f5F12CF532E8D0E65F0E79eb25aa949000`)
- `DEPLOYED_CONTRACT_ADDRESS` = events contract (e.g. `0x961F90f5F12CF532E8D0E65F0E79eb25aa949000`)
- `ARTIST_CONTRACT_ADDRESS` = events contract (e.g. `0xC89642668A64A5CeEF51B5dCe4621ACA209b82a6`)

## adding/updating artists

Then we need to add artists:

```bash
cd hardhat
source .env
export ARTIST=artist1
export ADDRESS='0x9e24343032E385a6d0FEaeAd89628F9110a43375'
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

<!--
export ARTIST=mckhallstyle
PROMPT='rainbow unicorn' npx hardhat --network filecoinHyperspace run scripts/generateImage.ts -->

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
ARTIST_COST=100 IMAGE_COST=100 ARTIST_COMMISSION=20 \
  npx hardhat --network filecoinHyperspace run scripts/changePrice.ts
ARTIST=mckhallstyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
ARTIST=SARAH_RICHTER ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
ARTIST=bcistyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
ARTIST=mntstyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
ARTIST=btzstyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
ARTIST=cecnstyle ADDRESS=0x230115404c551Fcd0B6d447DE1DaD3afca230E07 npx hardhat --network filecoinHyperspace run scripts/addArtist.ts
npx hardhat --network filecoinHyperspace run scripts/listArtists.ts
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
export CI_COMMIT_SHA=$(git rev-parse HEAD)
export FILESTORE_IMAGE=gcr.io/webkit-servers/waterlily-filestore:$CI_COMMIT_SHA
docker build -t $FILESTORE_IMAGE filestore
docker push $FILESTORE_IMAGE
export FILESTORE_TOKEN=XXX
cat filestore-deploy/04-deployment.yaml | envsubst | kubectl apply -f -
```

The image store is deployed to https://ai-art-files.cluster.world/

## changing the bacalhau job spec

The smart contract issues a JSON packet to the bridge with a `_lilypad_template` field.

This runs the functions in `lilypad/pkg/bridge/spec_templates.go`.

To change the job spec that is run on bacalhau - change the spec in `spec_templates.go` and re-deploy the bridge.


## pulling docker images

We have a cluster of machines running on https://cloud.lambdalabs.com/

To prepare the bacalhau nodes we want to pull all of the docker images beforehand:

Login to LambdaLabs and click the "IDE" button on each of the instances:

```bash
sudo docker pull algoveraai/sdprojectv2:mckhallstyle
sudo docker pull algoveraai/sdprojectv2:SARAH_RICHTER
sudo docker pull algoveraai/sdprojectv2:bcistyle
sudo docker pull algoveraai/sdprojectv2:mntstyle
sudo docker pull algoveraai/sdprojectv2:btzstyle
sudo docker pull algoveraai/sdprojectv2:cecnstyle
```

## running against testnet

To launch the frontend against the testnet - add the following to the URL in your browser (works on localhost and production both):

`?waterlilyNetwork=filecoinHyperspace`


## uploading artist thumbnails

If you need to upload anything to the filestore:

```
curl -F "uploads=@cecnstyle.png" -F "path=artist_thumbnails" https://ai-art-files.cluster.world/upload?access_token=XXX
```

## compiling smart contracts

First we need to make sure we have abigen in our path:

```bash
go install github.com/ethereum/go-ethereum/cmd/abigen@v1.10.26
```

You will also need jq installed.

Then we can compile the contracts:

```bash
cd hardhat
npm run compile
```

## deployment v2

```bash
cd hardhat
source .env
npx hardhat compile
npx hardhat --network filecoinHyperspace run scripts/deploy.ts
ARTIST_COST=100 IMAGE_COST=100 ARTIST_COMMISSION=20 \
  npx hardhat --network filecoinHyperspace run scripts/changePrice.ts
```

Set the address that is printed to the `CONTRACT_ADDRESS` env var inside `.env` or `.env.testnet`.

## dev v2

Export vars:

```bash
export BACALHAU_API_HOST=ai-art-requester.cluster.world
export CONTRACT_ADDRESS=...
export WALLET_PRIVATE_KEY=...
export FILESTORE_TOKEN=wGARXp2KbjPrf9wYdLjU
export FILESTORE_DIRECTORY=/tmp/waterlily-files
export SQLITE_DATA_FILE=/tmp/waterlily.db
export RPC_ENDPOINT=https://api.hyperspace.node.glif.io/rpc/v1
export CHAIN_ID=3141
export BIND_PORT=3500
```

Create filestore dir:

```bash
mkdir -p $FILESTORE_DIRECTORY
```

Start server:

```bash
go run . serve
```