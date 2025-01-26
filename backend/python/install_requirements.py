import subprocess
import sys

required_packages = ['scapy', 'netifaces']

def install(package):
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        install(package)
