"""Read the final app's Info.plist from an IPA, including binary plists."""

import json
import plistlib
import sys
import zipfile


def read_minimum(path):
    with zipfile.ZipFile(path) as archive:
        # Only the main app, not embedded extensions or frameworks.
        candidates = [
            name for name in archive.namelist()
            if len(name.split("/")) == 3
            and name.split("/")[0] == "Payload"
            and name.split("/")[1].endswith(".app")
            and name.split("/")[2] == "Info.plist"
        ]
        if len(candidates) != 1:
            raise ValueError(
                f"Expected exactly one Payload/*.app/Info.plist, found {len(candidates)}."
            )
        info = plistlib.loads(archive.read(candidates[0]))
        return {"plist": candidates[0], "minimum": info.get("MinimumOSVersion")}


if __name__ == "__main__":
    try:
        print(json.dumps(read_minimum(sys.argv[1])))
    except Exception as error:
        print(f"Cannot inspect exported IPA: {error}", file=sys.stderr)
        sys.exit(1)
