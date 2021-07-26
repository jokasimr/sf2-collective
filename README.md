
# A collective with a github? sound dorky as sh\*t


Well.. yes.


## How to change something?

### Setup
[Install Deno](https://deno.land/manual/getting_started/installation) 

[Install `deployctl`](https://deno.com/deploy/docs/deployctl) 

Ask Johannes for some secret environment variables.
 
### Run locally

Enter the root folder of the project and run

`deployctl run --no-check --watch cleaning/index.jsx`


### Deploy

Push to the `staging` branch to test changes in the live environment.
They are reflected at [https://sf2-staging.deno.dev/](https://sf2-staging.deno.dev/).

Push to the `master` branch to deploy.
They are reflected at [https://sf2.deno.dev/](https://sf2-staging.deno.dev/).
