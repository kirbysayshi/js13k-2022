#!/bin/bash

# Create an atlas from all .aseprite files in the directory. Each aseprite tag
# must be unique across filenames in order to not clobber! Only the tags are
# used because it seems that aseprite does not associate the filename with the
# tags in the json output.

/Applications/Aseprite.app/Contents/MacOS/aseprite \
  -b \
  ./assets/pipeline-input-aseprite/*.aseprite \
  --sheet-pack \
  --list-tags \
  --filename-format '{tag}_{frame}' --trim \
  --sheet ./assets/pipeline-output-aseprite/atlas.png \
  --data ./assets/pipeline-output-aseprite/atlas.json  \
  --trim

# Convert the JSON output to a typescript file so the sprite names are known at compile time.
NODE_SCRIPT=$(cat <<-END
  var atlas = fs.readFileSync("/dev/stdin","utf8");
  const ts = "const json = " + atlas.trim() + " as const; export default json;";
  fs.writeFileSync("./assets/pipeline-output-aseprite/atlas.ts", ts);
END
)
<./assets/pipeline-output-aseprite/atlas.json node -e "$NODE_SCRIPT"