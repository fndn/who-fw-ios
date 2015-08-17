## Supported Barcodes

- aztec
- code138
- code39
- code39mod43
- code93
- ean13
- ean8
- pdf417
- qr
- upce


## Run
	
	cd {project dir}
	npm install
	open FWA.xcodeproject


## Install (workstation setup)

#### NVM
	
	$ curl https://raw.githubusercontent.com/creationix/nvm/v0.23.2/install.sh | bash
	$ source ~/.bashrc

Add the following to ~/.bash_profile

	export NVM_DIR="/Users/js/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

  
  
#### IOJS

	$ nvm install iojs-v2 && nvm alias default iojs-v2


#### Update watchman

	brew update
	brew upgrade watchman
	







