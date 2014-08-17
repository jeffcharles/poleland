# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.define "couchbase" do |couchbase|
    couchbase.vm.box = "ubuntu/precise64"
    couchbase.vm.box_url = "https://vagrantcloud.com/ubuntu/precise64/version/1/provider/virtualbox.box"

    couchbase.vm.network :forwarded_port, guest: 8091, host: 8091

    couchbase.vm.network :private_network, ip: "10.0.0.2", :netmask => "255.255.0.0"

    config.vm.provider "virtualbox" do |v|
      v.memory = 1024
    end

    # provisioning is done in the web ansible provisioning step
  end

  config.vm.define "web" do |web|
    web.vm.box = "ubuntu/trusty64"
    web.vm.box_url = "https://vagrantcloud.com/ubuntu/trusty64/version/1/provider/virtualbox.box"

    web.vm.network :forwarded_port, guest:80, host:8080
    web.vm.network :forwarded_port, guest: 3000, host: 3000

    web.vm.network :private_network, type: :dhcp, :netmask => "255.255.0.0"

    web.vm.provision "ansible" do |ansible|
      # This provisions both virtual machines
      ansible.playbook = "provisioning/site.yml"
      ansible.limit = 'all'
      ansible.sudo = true
      ansible.extra_vars = {
        admin_user: "poleland",
        admin_password: "poleland"
      }
    end
  end

end
