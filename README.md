# Code Kahoot

Imagining a Kahoot-alike game where you get an editor and simple coding
challenges. 

# Development

Start-up the dev environment
```
firebase emulators:start 
```

Create the `.env` by exporting the firebase config as JSON (manually)
```
openssl base64 -in env.json | tr -d '\n' | pbcopy
```

Example `env.json`
```json
{
  "apiKey": "-",
  "authDomain": "-",
  "databaseURL": "-",
  "projectId": "-",
  "storageBucket": "-",
  "messagingSenderId": "-",
  "appId": "-"
}
```

# TODO
Since this repo is a work-in-progress and since I don't know how much time I'll 
actually be spending on creating it. I'll capture my thoughts here.
---

Switching the focus from authentication to building the UI. If new requirements
arise I'll create those testcases on the fly.

## Brain-dump

Switching the focus from authentication to building the UI. If new requirements
arise I'll create those testcases on the fly.

## Notes
In the future I might be able to use
```
firebase deploy --only database
```
To only update _Firebase Realtime Database rules_