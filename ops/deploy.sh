#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

ZONE="us-central1-a"
NAME="artist-vm-0"

function gSSH() {
    gcloud compute ssh --quiet --zone=$ZONE $NAME -- sudo $*
}

function gSCP() {
    gcloud compute scp --quiet --zone=$ZONE $1 $NAME:$2
}

gSCP ../hardhat/.env /tmp/env
gSSH mv /tmp/env /root/lilypad.env
gSSH chmod 0400 /root/lilypad.env

gSCP ../hardhat/.env.testnet /tmp/env.testnet
gSSH mv /tmp/env.testnet /root/lilypad.testnet.env
gSSH chmod 0400 /root/lilypad.testnet.env

gSCP lilypad.service /tmp/lilypad.service
gSSH mv /tmp/lilypad.service /etc/systemd/system/lilypad.service
gSSH chmod 0444 /etc/systemd/system/lilypad.service

gSCP lilypad-testnet.service /tmp/lilypad-testnet.service
gSSH mv /tmp/lilypad-testnet.service /etc/systemd/system/lilypad-testnet.service
gSSH chmod 0444 /etc/systemd/system/lilypad-testnet.service

gSCP ./../../lilypad/bin/lilypad-linux-amd64 /tmp/lilypad
gSSH mv /tmp/lilypad /usr/bin/lilypad
gSSH chmod 0555 /usr/bin/lilypad

gSSH systemctl daemon-reload
gSSH systemctl enable lilypad
gSSH systemctl enable lilypad-testnet
gSSH systemctl restart lilypad
gSSH systemctl restart lilypad-testnet
