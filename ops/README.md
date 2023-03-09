## artist

This is the deployment for the AI-Artist-Attribution project.

We run this as:

 * a vercel app hosting the frontend
 * some smart contracts on FVM
 * a golang process on a google cloud VM
 * a private bacalhau cluster

## deploy smart contracts

TBC

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