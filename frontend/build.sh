rm -rf .next;
rm -rf out;
yarn next build;
yarn next export;
tar czvf $(git describe --tags)_commander_public.tar out;
cp $(git describe --tags)_commander_public.tar ~/Desktop