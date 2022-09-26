import path from "path";
import webpack from "webpack";
import fs from "fs";

import Copy from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { loadModule } from "./pkg";
import { fstat } from "fs";

export default (env: any, argv: any) => {

    const isDev = argv.mode === "development";
    const dist = path.resolve(__dirname, 'dist')
    const config: webpack.Configuration = {
        entry: {
            background: "./src/background.ts"
        },
        output: {
            path: dist,
            clean: {
                keep: "config.json"
            }
        },
        performance: {
            maxAssetSize: 1500000,
            maxEntrypointSize: 1500000
        },
        optimization: {
            minimize: !isDev,
        },
        devtool: isDev ? "source-map" : false,
        plugins: [
            new Copy({
                patterns: [ 
                    "./src/icon/icon.png",
                    "./src/config.schema.json",
                    { 
                        from:"./src/config.json",
                        filter: async (p) => new Promise((r) => fs.access(path.resolve(dist, path.basename(p)), e => r(Boolean(e))))
                    },
                    { 
                        from: "./manifest.ts", 
                        to: "manifest.json", 
                        transform: (content, p) => Buffer.from(JSON.stringify(loadModule("./manifest").default))
                    }
                ]
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            env.analyze && new BundleAnalyzerPlugin()
        ].filter(v => v),
        module: {
            rules: [
                {
                    test: /\.ts$/i,
                    loader: 'ts-loader',
                    exclude: ['/node_modules/'],
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.ts'],
            fallback: {
                buffer: require.resolve('buffer/'),
            }
        }
    };
    return config;
};

