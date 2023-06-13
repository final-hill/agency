const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    entry: {
        main: './src/agent/index.ts',
        agents: './src/agents/index.ts'
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist`,
        clean: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: './package.json',
                to: './package.json',
                transform(content) {
                    const pkg = JSON.parse(content.toString())
                    pkg.devDependencies = {}
                    pkg.scripts = {}
                    return Buffer.from(JSON.stringify(pkg, null, 4))
                }
            }]
        })
    ]
}