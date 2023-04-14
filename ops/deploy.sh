#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ZONE="us-central1-a"
NAME="artist-vm-0"

function gSSH() {
    gcloud compute ssh --quiet --zone=$ZONE $NAME -- sudo $*
}

function gSCP() {
    gcloud compute scp --quiet --zone=$ZONE $1 $NAME:$2
}

function upload() {
  (cd $DIR/../api && go build)
  gSCP $DIR/../api/api /tmp/waterlily
  gSSH mv /tmp/waterlily /usr/bin/waterlily
  gSSH chmod 0555 /usr/bin/waterlily
}

function deploystaging() {
  gSCP $DIR/../hardhat/.env.testnet /tmp/env.testnet
  gSSH mv /tmp/env.testnet /root/waterlily.staging.env
  gSSH chmod 0400 /root/waterlily.staging.env

  gSCP $DIR/waterlily-staging.service /tmp/waterlily-staging.service
  gSSH mv /tmp/waterlily-staging.service /etc/systemd/system/waterlily-staging.service
  gSSH chmod 0444 /etc/systemd/system/waterlily-staging.service

  gSSH systemctl daemon-reload
  gSSH systemctl enable waterlily-staging
  gSSH systemctl restart waterlily-staging
}

function deployproduction() {
  gSCP $DIR/../hardhat/.env /tmp/env
  gSSH mv /tmp/env /root/waterlily.env
  gSSH chmod 0400 /root/waterlily.env

  gSCP $DIR/waterlily.service /tmp/waterlily.service
  gSSH mv /tmp/waterlily.service /etc/systemd/system/waterlily.service
  gSSH chmod 0444 /etc/systemd/system/waterlily.service

  gSSH systemctl daemon-reload
  gSSH systemctl enable waterlily
  gSSH systemctl restart waterlily
}

eval "$@"