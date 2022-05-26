import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'
const plugins = [
    nodeResolve({
        browser: false
    }),
    commonjs(),
    babel({ 
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
    copy({
        targets: [
            {
                src: 'src/auto-router.js',
                dest: 'dist'
            },
            {
                src: 'src/index.fg.js',
                dest: 'dist'
            },
            {
                src: 'src/utils.js',
                dest: 'dist'
            },
            // {
            //     src: 'src/LayoutSkeleton.vue',
            //     dest: 'dist'
            // },
            // {
            //     src: 'src/PageSkeleton.vue',
            //     dest: 'dist'
            // }
        ]
    }),
    process.env.ENV === 'prod' && terser()
] 
const name = 'vitePluginAutoVueRouter'
export default [
	{
		input: './src/index.fg.js',
		output: {
			name: name,
			file: pkg.main,
			format: 'cjs',
            exports: 'default',
		},
		plugins
	},
    {
		input: './src/index.js',
		output: {
			name: name+'/index',
			file: 'dist/index.js',
			format: 'cjs',
            exports: 'default',
		},
		plugins
	},
];
