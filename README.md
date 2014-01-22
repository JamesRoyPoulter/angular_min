/************* SETUP ************/
To get setup the first time there are a number of commands and programmes you need to install to run the anguar app.

If you already run angular apps, and have node, grunt and bower installed, simply run

  npm install
  bower update
  grunt server

And everything should work. Otherwise, follow the rest of this install guide!

You need the node package manager installed. If you don't already have this, take a look at the following to see which method works best for you:

  https://npmjs.org/
  https://gist.github.com/isaacs/579814

Once npm is installed, you can use it to download grunt:

  npm install -g grunt-cli

Then for the bower installation:

  npm install -g bower

Then ensure you are in the repo and run:

  npm install

It may be worth running this command again, until it appears to be doing nothing anymore. Then run:

  bower update

Again, you may want to do more than once. Then run

  grunt build

Then finally run

  grunt server

This should open the app in a new browser window. Enjoy!

/********* CONFIGURATION TROUBLESHOOTING ********/


- compass / sass error

If on 'grunt server' you receive an error that you need ruby and compass, do the following, from: https://github.com/gruntjs/grunt-contrib-compass, run

  grunt compass

If this doesn't work, run

  sudo gem update --system


probs no need for bundle
  gem install bundle

  bundle update

  gem install sass

  gem install compass

You need to have sass version 3.2.13, and compass version 0.12.2. You can see what version you have by running:

  gem list

If you don't you need to run

  gem uninstall sass

Check this has uninstalled all versions of Sass (run gem list), otherwise run the same command again until all versions of Sass are removed. Then run

  gem install sass --version 3.2.13

-- rvm error

RVM things:

\curl -sSL https://get.rvm.io | bash 

sudo vim .bashrc

"$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

vi .bash_profile

[[ -r ~/.bashrc ]] && . ~/.bashrc


/****** WORKING WITH APP ******/

Once grunt server is running, changes are automatically compiled and the browser automatically refreshed. There is in-built error-checking (jslint) that will ping you notifiers in terminal as the server runs and registers errors.

If you are using this app before the services are pulling real data, out of date data may cause bugs. Therefore, update:

  app/data/days.json