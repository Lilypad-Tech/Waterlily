import os, sys
def upload(path, files):
    token = os.getenv("FILESTORE_ACCESS_TOKEN")
    url = os.getenv("FILESTORE_URL")
    files = " ".join(f"-F \"uploads=@{x}\"" for x in files)
    cmd = (
        f"curl --insecure {files} -F \"path={path}\" {url}?access_token={token}")
    print(f"Running: {cmd}")
    os.system(cmd)

def upload_files(outpath):
    prefix = os.getenv("WATERLILY_JOB_ID")
    os.chdir(outpath)
    os.system("mv *_0.png image_0.png")
    os.system("mv *_1.png image_1.png")
    os.system("mv *_2.png image_2.png")
    os.system("mv *_3.png image_3.png")
    os.system("mv *.jpg combined.jpg")
    upload("job/"+prefix, os.listdir(outpath))

if __name__ == "__main__":
    # Usage: upload.py /outputs will upload /outputs/*
    upload_files(sys.argv[1])
