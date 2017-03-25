build: clean webpack assets

clean:
	rm -rf dist

webpack:
	npm run build:dist

assets:
	cp img/* dist/ && cp index.html dist/ && cp favicon.ico dist/

install:
	npm install

run:
	npm run dist:server
