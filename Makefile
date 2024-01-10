.PHONY: all iv key encrypt

all: iv key encrypt

iv:
	@openssl rand -hex 16 > public/data/iv.txt
	@echo 'public/data/iv.txt generated; now encrypt'

key:
	@openssl rand -base64 32 > symmetric_key.txt && \
	SYMMETRIC_KEY=$$(cat symmetric_key.txt) && \
	echo SYMMETRIC_KEY=$$SYMMETRIC_KEY > .env.local
	@echo 'symmetric_key.txt generated and added to .env.local'

encrypt:
	@openssl enc -aes-256-cbc -pbkdf2 -nosalt -in public/data/test.txt -out public/data/test.aes -pass file:symmetric_key.txt -iv $(shell cat public/data/iv.txt)
	@echo 'public/data/test.aes generated'

clean:
	rm symmetric_key.txt public/data/test.aes public/data/iv.txt
