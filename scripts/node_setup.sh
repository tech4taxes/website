#!/usr/bin/env bash

# Run me from the flask folder!
# Like
# >flask$ ../scripts/node_setup.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
.  "$HOME/.nvm/nvm.sh"
nvm install 22
npm install
npm run build  # this builds the production assets so may not be necessary for local dev!
