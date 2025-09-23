// Charger les variables d'environnement depuis .env
require('dotenv').config();

export default {
  expo: {
    name: "wildwatch",
    slug: "wildwatch",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    android: {
      package: "com.cloeshiro.wildwatch",
    },
    plugins: [
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsImpl: "mapbox",
          RNMapboxMapsDownloadToken: process.env.MAPBOX_PRIVATE_TOKEN || "",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
