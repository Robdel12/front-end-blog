#!/bin/bash
# Based on https://github.com/knomedia/ember-cli-rails/blob/master/build.sh

#for (( i = 0; i < 17; i++ )); do echo "$(tput setaf $i)This is ($i) $(tput sgr0)"; done

function printMessage {
color=$(tput setaf $1)
message=$2
reset=$(tput sgr0)
echo -e "${color}${message}${reset}"
}

function boldMessage {
color=$(tput setaf $1)
message=$2
reset=$(tput sgr0)
echo -e "${color}*************************************${reset}"
echo -e "${color}${message}${reset}"
echo -e "${color}*************************************${reset}"
}

boldMessage 14 "Building Ember app"
cd ../ember
ember build --environment production
cd ../rails

rm -rf public/assets
rm -rf public/ember-assets

printMessage 14 "Copying ember build files to rails"
cp -r ../ember/dist/* public/

printMessage 14 "Swaping assets dir for ember-assets"
mv public/assets public/ember-assets

printMessage 14 "replacing references s/assets/ember-assets/ in public/index.html"
sed -i.bck s/assets/ember-assets/ public/index.html

printMessage 14 "inserting csrf_meta_tags in head"
sed -i.bck 's/<\/head>/  <%= csrf_meta_tags %>&/' public/index.html

printMessage 14 "inserting yield in body"
sed -i.bck 's/<body>/&\n    <%= yield %>/' public/index.html

printMessage 14 "Replacing application.html.erb with index.html"
mv public/index.html app/views/layouts/application.html.erb

printMessage 14 "Cleaning Up"
rm public/index.html.bck

boldMessage 14 "Done"
