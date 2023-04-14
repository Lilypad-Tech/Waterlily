#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

if [[ -z "$ARTIST_ID" ]]; then
  echo 1>&2 "ARTIST_ID is not set"
  exit 1
fi

if [[ -z "$IMAGES_DOWNLOAD_URL" ]]; then
  echo 1>&2 "IMAGES_DOWNLOAD_URL is not set"
  exit 1
fi

# this URL will contain the token and path
if [[ -z "$WEIGHTS_UPLOAD_URL" ]]; then
  echo 1>&2 "WEIGHTS_UPLOAD_URL is not set"
  exit 1
fi

function download_images() {
  echo "download_images"
  mkdir -p /inputs
  curl -o /tmp/images.tar.gz "$IMAGES_DOWNLOAD_URL"
  tar -xvf /tmp/images.tar.gz -C /inputs
}

function run_training() {
  echo "run_training"
  python main.py -o "/outputs" -t "$ARTIST_ID" -ts 1000
}

function upload_weights() {
  echo "upload_weights"
  tar -cf /tmp/weights.tar -C /outputs .
  gzip /tmp/weights.tar
  curl -XPOST --insecure -F "uploads=@/tmp/weights.tar.gz" "$WEIGHTS_UPLOAD_URL"
}

download_images
run_training
upload_weights
