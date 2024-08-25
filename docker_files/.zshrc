# Lines configured by zsh-newuser-install
HISTFILE=~/.zsh_history
HISTSIZE=1000
SAVEHIST=1000
setopt autocd             # Auto change to directory when typing directory name
setopt appendhistory      # Append history to the history file (don't overwrite it)
setopt sharehistory       # Share command history data between running Zsh sessions
setopt inc_append_history # Write history changes to disk immediately
setopt extended_glob      # Use extended globbing (e.g., **/*.txt for all text files recursively)

# Customize prompt (default prompt setup)
PROMPT='%n@%m %1~ %# '

# User configuration
alias ll='ls -l'
alias la='ls -a'
alias l='ls -CF'

#Load other custom aliases
if [ -f ~/.zsh_aliases ]; then
    . ~/.zsh_aliases
fi

# Homebrew setup
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"