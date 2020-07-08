# Informatique debranchee

Project DAWIN by Laurie Dumery, Romain Roubaix & Pierre Moinet

Appli pensée mobile first ->
For development, use iphone 6/7/8 (375 x 667)

For local dev:
npm install (once)
npm run start

Link to gh-pages: https://spoogetti.github.io/informatique_debranchee/

Deploy on gh-pages
npm run build
git subtree push --prefix dist origin gh-pages

If the deploy says you can't:
git checkout master # you can avoid this line if you are in master...
git subtree split --prefix dist -b gh-pages # create a local gh-pages branch containing the splitted output folder
git push -f origin gh-pages:gh-pages # force the push of the gh-pages branch to the remote gh-pages branch at origin
git branch -D gh-pages # delete the local gh-pages because you will need it
