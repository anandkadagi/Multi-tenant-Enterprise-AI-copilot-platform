# FROM python:3.11-slim

# WORKDIR /app

# # Install build tools and C-library headers required by PyMuPDF, lxml, and python-magic
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     gcc \
#     g++ \
#     curl \
#     libmagic1 \
#     libmagic-dev \
#     libxml2-dev \
#     libxslt1-dev \
#     zlib1g-dev \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .

# # Upgrade pip and wheel first to ensure binary wheels are preferred over source builds
# RUN pip install --no-cache-dir --upgrade pip setuptools wheel
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8000

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


FROM python:3.11-slim AS builder

WORKDIR /build

# Install build tools needed only during compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libmagic-dev \
    libxml2-dev \
    libxslt1-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# 1. Install CPU-only torch first into a target wheel directory
RUN pip install --no-cache-dir \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    torch==2.12.0

# 2. Build/download remaining wheels
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


FROM python:3.11-slim AS runtime

WORKDIR /app

# Only install shared runtime dynamic libraries (NO compilers, NO dev headers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    libxslt1.1 \
    zlib1g \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed site-packages directly from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application source code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]