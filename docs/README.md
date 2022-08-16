# BrewTheory v0.0

## Vendor Dependencies

The rules for how 3rd-party vendor dependencies are handled are slightly different 
depending on the language ecosystem.  The following sections lay out the per-language 
rules.

### Go

These are the rules we follow for Go dependencies:

- Included using the modern `go mod` tools.
- Vendored using `go mod vendor` tool and the `-mod=vendor` flag.
- Committed to the repository in the root `vendor/` directory.**

** While the Go module tools do a decent job at assuring dependency integrity out of the box,
by committing them directly into the repo, we get some extra benefits:

- There is a direct opportunity to review what exactly has changed when updating dependencies.
- Not having to download the dependencies in CI/CD pipelines removes a PoF and may improve pipeline performance.

While this does result in increasing the size of the repository and creates some extra git history noise, 
we feel that these are acceptable trade-offs for improving supply chain security and reducing some operational
complexity.


### Javascript

These are the rules we follow for Javascript dependencies:

- All packages specified in `package.json` must specify exact versions with no loose modifiers allowed (e.g. `^`, wildcards, etc).
- `node_modules` is `.gitignore`d.**

** Unfortunately, `node_modules` is well-established to be crazypants big in most projects to make it unreasonable to 
try committing it.
