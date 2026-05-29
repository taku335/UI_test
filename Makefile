.PHONY: install dev build preview clean lint format

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf node_modules dist

lint:
	npm run lint

format:
	npm run format
