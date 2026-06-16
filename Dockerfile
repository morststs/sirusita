FROM golang:1.23-bookworm

# System dependencies for Wails
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    libgtk-3-dev \
    libwebkit2gtk-4.0-dev \
    libwebkit2gtk-4.1-dev \
    build-essential \
    pkg-config \
    gcc-mingw-w64-x86-64 \
    nsis \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 LTS (Svelte 5 / Vite 7 require Node 20.19+ / 22.12+)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && node -v && npm -v

# Install Wails CLI
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

WORKDIR /app

# Default command
CMD ["bash"]
