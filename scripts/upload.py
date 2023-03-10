import os, sys
def upload(path, files):
    os.system("sudo apt install -y curl")
    files = " ".join(f"-F \"uploads=@{x}\"" for x in files)
    cmd = (
        f"curl --insecure {files} -F \"path={path}\" https://ai-art-files.cluster.world/upload")
    print(f"Running: {cmd}")
    os.system(cmd)

def upload_files(outpath):
    prefix = os.getenv("WATERLILY_JOB_ID")
    upload("job/"+prefix, os.listdir(outpath))

if __name__ == "__main__":
    # Usage: upload.py /outputs will upload /outputs/*
    upload_files(sys.argv[1])
