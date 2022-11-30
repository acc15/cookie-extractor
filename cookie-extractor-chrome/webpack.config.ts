import path from "path";
import webpack from "webpack";

import Copy from 'copy-webpack-plugin';
import Html from 'html-webpack-plugin';
import Css from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { loadModule } from "./pkg";

export default (env: any, argv: any) => {

    const isDev = argv.mode === "development";
    const dist = path.resolve(__dirname, 'dist')
    const config: webpack.Configuration = {
        entry: {
            background: "./src/background.ts",
            opts: "./src/opts/opts.ts"
        },
        output: {
            path: dist,
            assetModuleFilename: '[name][ext]',
            clean: true
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
                    { 
                        from: "./manifest.ts", 
                        to: "manifest.json", 
                        transform: (content, p) => Buffer.from(JSON.stringify(loadModule("./manifest").default))
                    }
                ]
            }),
            new Html({ template: "./src/opts/opts.html", filename: "opts.html", chunks: ["opts"] }),
            new Css(),
            env.analyze && new BundleAnalyzerPlugin()
        ].filter(v => v),
        module: {
            rules: [
                {
                    test: /\.ts$/i,
                    loader: 'ts-loader',
                    exclude: ['/node_modules/'],
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.svg$/i,
                    type: "asset",
                    use: "svgo-loader"
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.ts'],
        }
    };
    return config;
};

