import path from "path";
import webpack from "webpack";

import Copy from 'copy-webpack-plugin';
import Html from 'html-webpack-plugin';
import Css from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { pkg, loadModule } from "./pkg";

export default (env: any, argv: any) => {

    const isDev = argv.mode === "development";

    const config: webpack.Configuration = {
        entry: {
            background: "./src/background.ts",
            opts: "./src/opts.tsx"
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            assetModuleFilename: "[base]",
            clean: true
        },
        performance: {
            maxAssetSize: 1500000,
            maxEntrypointSize: 1500000
        },
        optimization: {
            minimize: !isDev,
            /*splitChunks: {
                chunks: "all",
                cacheGroups: {
                    "react-dom": {
                        test: /[\\/]node_modules[\\/]react-dom[\\/]/,
                        name: "react-dom"
                    },
                    "mui": {
                        test: /[\\/]node_modules[\\/]@mui[\\/]/,
                        name: "mui"
                    },
                    defaultVendor: {
                        name: "vendors",
                        priority: -10
                    }
                }
            }  */
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
            new Html({
                title: `${pkg.name} options`,
                chunks: [ 'opts' ],
                filename: "opts.html"
            }),
            new Css(),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            env.analyze && new BundleAnalyzerPlugin()
        ].filter(v => v),
        module: {
            rules: [
                {
                    test: /\.tsx?$/i,
                    loader: 'ts-loader',
                    exclude: ['/node_modules/'],
                },
                {
                    test: /\.css$/i,
                    use: [Css.loader, "css-loader"]
                },
                {
                    test: /\.svg$/i,
                    type: "asset"
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            fallback: {
                buffer: require.resolve('buffer/'),
            }
        }
    };
    return config;
};

