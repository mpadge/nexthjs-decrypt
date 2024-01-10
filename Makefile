.PHONY: all lint dev build

ENGINE=yarn
#ENGINE=npm run

all: dev

lint:
	$(ENGINE) lint

dev:
	$(ENGINE)  dev

build:
	yarn build

iv:
	@openssl rand -hex 16 > public/data/iv.txt
	@echo 'public/data/iv.txt generated; now encrypt'

key:
	@openssl rand -base64 32 > symmetric_key.txt
	@echo 'symmetric_key.txt generated and added to .env.local'
	@echo "SYMMETRIC_KEY=$(shell cat symmetric_key.txt)" > .env.local

encrypt_run:
	@openssl enc -aes-256-cbc -pbkdf2 -nosalt -in public/data/test.txt -out public/data/test.aes -pass file:symmetric_key.txt -iv $(shell cat public/data/iv.txt)
	@echo 'public/data/test.aes generated'

encrypt: iv key encrypt_run
