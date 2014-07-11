# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.define "couchbase" do |couchbase|
    couchbase.vm.box = "ubuntu/precise64"
    couchbase.vm.box_url = "https://vagrantcloud.com/ubuntu/precise64/version/1/provider/virtualbox.box"

    couchbase.vm.network :forwarded_port, guest: 8091, host: 8091

    couchbase.vm.provision "ansible" do |ansible|
      ansible.playbook = "provisioning/couchbase-playbook.yml"
      ansible.sudo = true
    end
  end

  config.vm.define "web" do |web|
    web.vm.box = "ubuntu/trusty64"
    web.vm.box_url = "https://vagrantcloud.com/ubuntu/trusty64/version/1/provider/virtualbox.box"

    web.vm.network :forwarded_port, guest:80, host:8080

    web.vm.provision "ansible" do |ansible|
      ansible.playbook = "provisioning/playbook.yml"
      ansible.sudo = true
    end
  end

end
