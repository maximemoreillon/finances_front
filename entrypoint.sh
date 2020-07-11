#!/bin/sh

ROOT_DIR=/app
VUE_APP_AUTHENTICATION_API_URL=banana

# Replace env vars in files served by NGINX
echo "Replacing eenvironment variables"
for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  #sed -i 's|VUE_APP_FINANCES_API_URL|'${VUE_APP_FINANCES_API_URL}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_API_URL|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_FRONT_URL|'${VUE_APP_AUTHENTICATION_FRONT_URL}'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'
