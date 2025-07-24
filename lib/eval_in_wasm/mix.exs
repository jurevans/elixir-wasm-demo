defmodule EvalInWasm.MixProject do
  use Mix.Project

  def project do
    [
      app: :eval_in_wasm,
      version: "0.1.0",
      elixir: "~> 1.17",
      start_permanent: Mix.env() == :prod,
      compilers: Mix.compilers(),
      deps: deps(),
      aliases: [
        build_wasm: ["popcorn.build_runtime --target wasm", "popcorn.cook"]
      ]
    ]
  end

  def application do
    [
      extra_applications: [],
      mod: {EvalInWasm.Application, []}
    ]
  end

  defp deps do
    [
      {:popcorn, "~> 0.1.0"},
      {:anoma_lib, github: "anoma/anoma", subdir: "apps/anoma_lib", tag: "v0.34.0"},
    ]
  end
end
