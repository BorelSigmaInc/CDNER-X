FROM rust:1.98-slim AS build
WORKDIR /app
COPY bonding-engine/Cargo.toml bonding-engine/Cargo.lock* ./
COPY bonding-engine/src ./src
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=build /app/target/release/bonding_engine /usr/local/bin/bonding_engine
CMD ["bonding_engine"]
