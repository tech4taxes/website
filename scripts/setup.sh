#!/usr/bin/env bash

set -euo pipefail

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

ask_permission() {
    local prompt="$1"
    read -r -p "$prompt [y/N]: " reply
    [[ "$reply" =~ ^[Yy]$ ]]
}

# --- Install nvm if missing ---
if ! command_exists nvm; then
    echo "nvm not found"
    if ask_permission "Would you like to install nvm?"; then
        export NVM_DIR="$HOME/.nvm"
        mkdir -p "$NVM_DIR"
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
        # Load nvm into current shell session
        export NVM_DIR="$HOME/.nvm"
        # shellcheck disable=SC1091
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
else
    echo "nvm already installed."
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# --- Install pyenv ---
if ! command_exists pyenv; then
    echo "pyenv not found"
    if ask_permission "Would you like to install pyenv?"; then
        curl https://pyenv.run | bash

        # Add pyenv to PATH for current shell session
        export PATH="$HOME/.pyenv/bin:$PATH"
        eval "$(pyenv init -)"
        eval "$(pyenv virtualenv-init -)"
    fi
else
    echo "pyenv already installed."
#    export PATH="$HOME/.pyenv/bin:$PATH"
#    eval "$(pyenv init -)"
#    eval "$(pyenv virtualenv-init -)"
fi

# --- Setup project ---
cd flask

echo "Setting up Node.js"
node_version="22"
nvm install "$node_version"
nvm use "$node_version"
npm install

# --- Python setup ---
echo "Setting up Python"
py_version="3.13.0"
if ! pyenv install --list | grep -q "$py_version"; then
    pyenv update
fi
pyenv install -s "$py_version"
pyenv local "$py_version"

# --- Virtual environment setup ---
echo "Activating Python virtual environment..."
if [ ! -d ".venv" ]; then
    python -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Environment setup complete!"
