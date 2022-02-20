FROM elixir:latest AS elixir-deps
WORKDIR /rook

RUN mix local.hex --force
RUN mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mix ua_inspector.download --force
RUN mix deps.compile

FROM node:latest AS node
WORKDIR /rook/assets

# Needed for phoenix.js
COPY --from=elixir-deps /rook/deps ../deps
COPY assets/package.json ./
COPY assets/yarn.lock ./

RUN yarn install

COPY assets ./
RUN yarn deploy

FROM elixir-deps AS elixir
WORKDIR /rook
ARG SECRET_KEY_BASE

COPY config config
COPY lib lib

COPY --from=node /rook/priv priv
RUN mix phx.digest

COPY --from=elixir-deps /rook ./
RUN mix do compile

ENV MIX_ENV=prod
ENV SECRET_KEY_BASE=$SECRET_KEY_BASE
CMD ["mix", "phx.server"]