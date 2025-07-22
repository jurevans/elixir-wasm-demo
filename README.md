# elixir-wasm-demo

This is a basic demonstration of running Elixir in AtomVM via Popcorn. More info will be added soon,
but the simplest way to test this is:

```bash
# Install npm deps:
npm install

# Build the library, requires a working Docker installation:
npm run build:lib

# Run the project:
npm run dev
```

Then, navigate to `http://localhost:5173`, you will see the demo page (default Vite/React page). Check the console for logs (enable `Verbose` to see debug traces).

What this demo is actually doing (for now), is sending a small bit of code to an Elixir app running in the VM. It is sent:

```elixir
case Enum.max([1, 2, 3]) do
    3 -> {:ok, 3}
    2 -> {:error, 2}
end
```

Then, the Elixir app returns the result (in this case `3`):

```json
{
  "data": "{:ok, 3}",
  "durationMs": 29.41000000014901
}
```

## TODO

- Add more interesting Elixir code to execute!
- Figure out how the `IFrame` injection can be packaged and simplified for users of our toolkit and hooks (this is the tricky part)
