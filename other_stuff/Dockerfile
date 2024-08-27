# Use the official Docker-in-Docker image
FROM docker:dind

# Install necessary dependencies
RUN apk add --no-cache \
    bash \
    shadow \
    sudo \
    zsh \
    curl \
    git \
    build-base \
    file

#### START: Install Brew as user named: nikki

# Create the nikki user with sudo privileges
RUN adduser -D -s /bin/zsh nikki && \
    addgroup nikki docker && \
    echo "nikki ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    mkdir -p /home/linuxbrew/.linuxbrew && \
    chown -R nikki: /home/linuxbrew/.linuxbrew

USER nikki

# Install Homebrew non-interactively with retry logic and log the output
RUN for i in {1..5}; do \
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" > /home/nikki/install.log 2>&1 && break || sleep 15; \
    done

# Display the installation log for debugging purposes
RUN cat /home/nikki/install.log

# With this:
RUN /bin/zsh

#### END: Install Brew as user named: nikki

# # Copy the default .zshrc file for the nikki user and set ownership
# COPY --chown=nikki:nikki ./docker_files/.zshrc /home/nikki/.zshrc

# # Set nikki as the default user for the container
# USER nikki

# # Source Homebrew environment and install gcc
# RUN /bin/zsh -c "eval \"$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)\" && brew install gcc"

# # Install Supabase via Homebrew
# RUN /bin/zsh -c "eval \"$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)\" && brew install supabase/tap/supabase"

# # Set the default command to Zsh
# CMD ["/bin/zsh"]
