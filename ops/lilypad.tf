provider "google" {
  project = "bacalhau-production"
  region  = "us-central1"
  zone    = "us-central1-a"
}

terraform {
  backend "gcs" {
    # this bucket lives in the bacalhau-cicd google project
    # https://console.cloud.google.com/storage/browser/bacalhau-global-storage;tab=objects?project=bacalhau-cicd
    bucket = "bacalhau-global-storage"
    prefix = "artist/terraform"
  }
}

// A single Google Cloud Engine instance
resource "google_compute_instance" "artist-vm" {
  name         = "artist-vm-0"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 100 # Gb
    }
  }

  network_interface {
    network    = google_compute_network.artist_network.name
    access_config {
      nat_ip = google_compute_address.ipv4_address.address
    }
  }

  allow_stopping_for_update = true
}

resource "google_compute_network" "artist_network" {
  name                    = "artist-network"
}

resource "google_compute_address" "ipv4_address" {
  region = "us-central1"
  name   = "artist-ipv4-address"
}

output "public_ip_address" {
  value = google_compute_instance.artist-vm.network_interface[0].access_config[0].nat_ip
}

resource "google_compute_firewall" "artist_ssh_firewall" {
  name    = "artist-ssh-firewall"
  network = google_compute_network.artist_network.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    // Port 22   - Provides ssh access to the bacalhau server, for debugging
    ports = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
}
