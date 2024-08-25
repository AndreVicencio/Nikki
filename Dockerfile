# Use the official Ubuntu base image
FROM ubuntu:latest

# Update the package list and install dependencies for Homebrew
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    file \
    git \
    sudo \
    zsh 


#### START: Install Brew as user named: oden

RUN useradd -m -s /bin/zsh oden && \
    usermod -aG sudo oden &&  \
    mkdir -p /home/linuxbrew/.linuxbrew && \
    chown -R oden: /home/linuxbrew/.linuxbrew && \
    echo "oden ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/oden

USER oden

# Install Homebrew non-interactively with retry logic
RUN for i in {1..5}; do \
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && break || sleep 15; \
    done

# Switch back to root to create the oden user and configure the environment
USER root


#### END: Install Brew as user named: oden
    
# Copy the default .zshrc file for the oden user
COPY ./docker_files/.zshrc /home/oden/.zshrc
RUN chown oden:oden /home/oden/.zshrc



# Set oden as the default user for the container
USER oden

# Explicitly source .zshrc and install Supabase
RUN zsh -c "source /home/oden/.zshrc && brew install supabase/tap/supabase"











# Set the default command to Zsh
CMD ["/bin/zsh"]



