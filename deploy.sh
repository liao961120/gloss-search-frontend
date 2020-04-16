#!/usr/bin/env sh
set -e

npm run build

cd dist
#echo 'https://glosss.netlify.com/* https://glosss.yongfu.name/:splat 301!' > _redirects

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/liao961120/gloss-search.git master:deploy

cd -
