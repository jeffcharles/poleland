Poleland
========

Deploying a dev instance
------------------------

1. Install Vagrant (I'm running version 1.5.1)
2. Install Ansible (I installed through Pip and am running version 1.5.3)
3. Run `vagrant up`

How to workaround compiler errors on OS X
-----------------------------------------

If you get an error that looks like:

  clang: error: unknown argument: '-mno-fused-madd' [-Wunused-command-line-argument-hard-error-in-future]
  clang: note: this will be a hard error (cannot be downgraded to a warning) in the future
  error: command 'cc' failed with exit status 1

You will need to have the `ARCHFLAGS` environment variable set to
`-Wno-error=unused-command-line-argument-hard-error-in-future` while compiling
(e.g.,
`sudo ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future pip install ansible`
)