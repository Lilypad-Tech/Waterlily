#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

if [[ -z "$ARTIST_ID" ]]; then
  echo 1>&2 "ARTIST_ID is not set"
  exit 1
fi

if [[ -z "$IMAGE_ID" ]]; then
  echo 1>&2 "IMAGE_ID is not set"
  exit 1
fi

if [[ -z "$PROMPT" ]]; then
  echo 1>&2 "PROMPT is not set"
  exit 1
fi

if [[ -z "$WEIGHTS_DOWNLOAD_URL" ]]; then
  echo 1>&2 "WEIGHTS_DOWNLOAD_URL is not set"
  exit 1
fi

# this URL will contain the token and path
if [[ -z "$IMAGES_UPLOAD_URL" ]]; then
  echo 1>&2 "IMAGES_UPLOAD_URL is not set"
  exit 1
fi

function download_weights() {
  echo "download_weights"
  mkdir -p /inputs/outputs
  curl -o /tmp/weights.tar.gz "$WEIGHTS_DOWNLOAD_URL"
  tar -xvf /tmp/weights.tar.gz -C /inputs/outputs
}

function run_inference() {
  echo "run_inference"
  python main.py --o "/outputs" --seed "$IMAGE_ID" --p "$PROMPT in the style of $ARTIST_ID"
}

function upload_image() {
  curl -XPOST --insecure -F "uploads=@/outputs/$1" "$IMAGES_UPLOAD_URL"
}

function upload_images() {
  echo "upload_images"
  upload_image image_0.png
  upload_image image_1.png
  upload_image image_2.png
  upload_image image_3.png
  upload_image combined.jpg
}

download_weights
run_inference
upload_images
