FROM ubuntu:noble AS build

ENV ERLANG_VERSION="26.0.2"
ENV ELIXIR_VERSION="1.17.3-otp-26"
ENV NODE_VERSION="22"
ENV EMSDK_VERSION="4.0.8"
ENV MIX_ENV=prod
ENV LC_ALL=C.UTF-8
ARG COMMIT_REF="af25ff6adde1090c51a85276aed132e2de7372f4"
WORKDIR /build/

# fetch `just` to manage build steps
RUN mkdir -p emsdk popcorn atomvm atomvm-out lib
COPY ./lib/eval_in_wasm ./lib/eval_in_wasm

RUN apt update && \
    apt -y install git curl && \
    curl -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin

RUN cat <<EOF > justfile
export ERL_AFLAGS := '+JMsingle true'
export DEBIAN_FRONTEND := 'noninteractive'
export PATH := "/build/emsdk:/build/emsdk/upstream/emscripten:${HOME}/.local/share/mise/shims:${PATH}"
export MISE_TRUSTED_CONFIG_PATHS := '/build/popcorn'
export EMSDK_QUIET := '1'

all: deps atomvm artifacts
deps: _fetch_repos _system_deps _languages _emsdk
artifacts: example_eval

[group('dependencies')]
[working-directory('/build')]
_fetch_repos:
    git clone https://github.com/emscripten-core/emsdk.git /build/emsdk
    git clone https://github.com/software-mansion/popcorn.git /build/popcorn
    git clone https://github.com/software-mansion-labs/FissionVM.git /build/atomvm
    cd /build/popcorn && git fetch && git checkout "${COMMIT_REF}"
    cd /build/atomvm && git fetch && git checkout swm
    # prepare for cmake
    cd /build/atomvm/src/platforms/emscripten && mkdir -p build

[group('dependencies')]
_system_deps:
    apt update
    apt install -y cmake gperf libmbedtls-dev zlib1g-dev git \
    automake make gcc g++ libssl-dev libncurses-dev \
    python3 xz-utils \
    gpg wget curl
    curl https://sh.rustup.rs -sSf | sh -s -- -y

    # install mise
    install -dm 755 /etc/apt/keyrings
    wget -qO - https://mise.jdx.dev/gpg-key.pub | gpg --dearmor > /etc/apt/keyrings/mise-archive-keyring.gpg
    echo "deb [signed-by=/etc/apt/keyrings/mise-archive-keyring.gpg arch=amd64,arm64] https://mise.jdx.dev/deb stable main" > /etc/apt/sources.list.d/mise.list
    apt update
    apt install -y mise

[group('dependencies')]
_languages: _system_deps
    mise use --global node@"${NODE_VERSION}"
    mise use --global erlang@"${ERLANG_VERSION}"
    mise use --global elixir@"${ELIXIR_VERSION}"
    mise install
    mix local.rebar --force
    mix local.hex -if-missing --force

[group('dependencies')]
[working-directory('/build/emsdk')]
_emsdk: _fetch_repos _system_deps
    git pull
    ./emsdk install "${EMSDK_VERSION}"
    ./emsdk activate "${EMSDK_VERSION}"

[working-directory('/build/atomvm/src/platforms/emscripten/build')]
atomvm: deps
    emcmake cmake .. -DAVM_EMSCRIPTEN_ENV=web
    emmake make -j$(nproc)

    cp src/AtomVM.mjs src/AtomVM.wasm /build/atomvm-out/

[group('examples')]
example_eval: (_example '/build/lib/eval_in_wasm')

[group('examples')]
_example dir: atomvm
    #!/usr/bin/env bash
    source $HOME/.cargo/env
    cd {{dir}} && \
    mix deps.get && \
    mix popcorn.cook && \
    cp /build/atomvm-out/AtomVM.mjs static/wasm/ && \
    cp /build/atomvm-out/AtomVM.wasm static/wasm/
EOF

RUN just 

FROM scratch
COPY --from=build /build/lib/eval_in_wasm/static/wasm/AtomVM.mjs /public/wasm/
COPY --from=build /build/lib/eval_in_wasm/static/wasm/AtomVM.wasm /public/wasm/
COPY --from=build /build/lib/eval_in_wasm/static/wasm/bundle.avm /public/wasm/
COPY --from=build /build/lib/eval_in_wasm/static/wasm/popcorn.js /public/wasm/
COPY --from=build /build/lib/eval_in_wasm/static/wasm/popcorn_iframe.js /public/wasm/

ENTRYPOINT ["/build"]
