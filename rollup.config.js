import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'pixelMage'
    },
    plugins: [
        serve({
            open: true,
            verbose: true,
            contentBase: ['dist', 'src'],
            host: 'localhost',
            port: 8080,
        }),
        livereload({
            watch: 'src',
            verbose: 'true',
        }),
        typescript(),
    ]
}
