
# On the Host Machine (Mac OS X)
#
# Before starting docker VM, I ran these on the host system (Mac OS X)
# just in case:
#
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65000
sudo sysctl -w kern.ipc.somaxconn=60000
ulimit -S -n 50000
#
# These are probably not necessary since Docker VMs appear to manage their own
# max file handle limits. Yet, better to be safe than sorry.

# Setup For Docker Instances (bastion, and services)
sysctl -w net.core.somaxconn=4096
# The default is 128, and you cannot update it without the `--privileged` flag.

BELOW IS DRAFT

# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #

# On the Docker Containers
#
# Make sure that your file handle and socket limits are good enough.

# Before running containers make sure that the host OS has networking
# set up properly. For this, use the following commands to set up the
# socket and file limits for the kernel.
# Do this before running the containers, as the containers will
# inherit from these settings.


#
# Tune your machine to remove any OS limits in terms of opening and quickly
# recycling sockets (for unices and for OS X)
#

# Setup for kernel (Host Machine):


# Setup for the shell (host Machine):


--------------------------------------------------------------------------------



# In code
