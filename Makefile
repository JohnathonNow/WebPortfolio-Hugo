website: 
	hugo --theme=modified_allegiant
webfromgit: git website
local:
	hugo serve --theme=modified_allegiant --bind 0.0.0.0 -b 10.0.0.101 --disableFastRender
git:
	git pull
deploy:
	git add *
	git commit
	git push
