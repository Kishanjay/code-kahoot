# Code Kahoot

Imagining a Kahoot-alike game where you get an editor and simple coding
challenges. 

# TODO
Since this repo is a work-in-progress and since I don't know how much time I'll 
actually be spending on creating it. I'll capture my thoughts here.
---

Working on getting the datamodel into firebase. For this I'm trying to finalise
what the `./src/models` will look like and how this fits into firebase and
`database.rules.json`.

Start-up the dev environment

```
firebase emulators:start 
```
## ENDNOTE

Authentication seems to be working decently. I'm not really sure yet which features
I should protect and which don't really matter. I finished writing some basic test-cases
that cover a fair bit

**NOTE**
In the future I might be able to use
```
firebase deploy --only database
```
To only update _Firebase Realtime Database rules_