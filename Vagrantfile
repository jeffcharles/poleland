# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.box_url = "https://vagrantcloud.com/ubuntu/trusty64/version/1/provider/virtualbox.box"

  config.vm.network :forwarded_port, guest:80, host:8080
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provisioning/site.yml"
    ansible.sudo = true
    ansible.extra_vars = {
      aws_access_key_id: "a",
      aws_secret_access_key: "a"
    }
  end

end
