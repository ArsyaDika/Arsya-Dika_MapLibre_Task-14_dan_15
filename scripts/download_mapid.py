"""Unduh layer MAPID yang dipakai peta ke folder data/ sebagai GeoJSON.

Dengan begitu API key cukup dipakai sekali di komputer sendiri dan tidak
perlu ditulis di app.js yang bisa dilihat siapa saja.

Pemakaian (key lama sudah terekspos, buat key baru di dashboard MAPID):
    MAPID_API_KEY=xxxx python scripts/download_mapid.py
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"

# nama file: (layer_id, project_id)
LAYERS = {
    "apartemen_bandung.geojson": ("69ace1b8643f7636a769ce7c", "69ab9fb96c69e6252868efaf"),
    "administrasi_bandung.geojson": ("69ace7646c69e62528aa09c5", "69ab9fb96c69e6252868efaf"),
    "rumah_sakit_semarang.geojson": ("697b23c047aaef41cdd4df6b", "69776f93e21f36c17f9c7004"),
    "administrasi_semarang.geojson": ("69ad12cd02854d1dfe4d287f", "69776f93e21f36c17f9c7004"),
}


def main():
    key = os.environ.get("MAPID_API_KEY")
    if not key:
        sys.exit("MAPID_API_KEY belum di-set")

    DATA.mkdir(exist_ok=True)
    for name, (layer_id, project_id) in LAYERS.items():
        query = urllib.parse.urlencode({"api_key": key, "layer_id": layer_id, "project_id": project_id})
        url = f"https://geoserver.mapid.io/layers_new/get_layer?{query}"
        with urllib.request.urlopen(url, timeout=60) as res:
            geojson = json.load(res)
        (DATA / name).write_text(json.dumps(geojson, separators=(",", ":")), encoding="utf-8")
        print(f"{name}: {len(geojson.get('features', []))} fitur")


if __name__ == "__main__":
    main()
