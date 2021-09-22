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
    watch: {
        include: 'src/**/*'
    },
    plugins: [
        typescript({'lib': ['es2020'], target: 'es2020'}),
        serve({
            open: true,
            verbose: true,
            contentBase: ['dist'],
            host: 'localhost',
            port: 8080,
        }),
        livereload({
            watch: 'dist',
            verbose: true,
        }),
    ]
}
