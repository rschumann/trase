#!/usr/bin/env bash

echo -e '// this file is generated by gis/getContextMaps.sh\n const contextLayersCarto = ' `./gis/cartodb/getContextMaps.js` '; \nexport default contextLayersCarto;' > scripts/actions/map/context_layers_carto.js