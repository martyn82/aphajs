
const sources = require.context('./../target/build/main/', true, /\.jsx?$/);
sources.keys().forEach(sources);
