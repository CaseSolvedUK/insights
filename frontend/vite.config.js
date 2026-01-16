import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import frappeui from 'frappe-ui/vite'
import path from 'path'
import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig(({ mode }) => ({
	plugins: [
		frappeui({
			frappeProxy: true,
			lucideIcons: true,
			jinjaBootData: true,
			buildConfig: false,
		}),
		vue(),
		vueJsx(),
//		visualizer({
//			filename: 'stats.html',
//			open: false,
//			template: 'flamegraph', // treemap, sunburst, flamegraph, network
//			gzipSize: true,
//			brotliSize: true,
//		}),
	],
	server: {
		allowedHosts: true,
	},
	esbuild: { loader: 'tsx' },
	resolve: {
		alias: [
			// https://github.com/vitejs/vite/discussions/16730#discussioncomment-13048825
			{ find: 'vue', replacement: 'vue/dist/vue.esm-bundler.js' },
			{ find: '@', replacement: path.resolve(__dirname, 'src') },
			{ find: /^frappe-ui$/, replacement: 'public/frappe-ui/index.js' },
			{ find: 'frappe-ui/text-editor', replacement: 'public/frappe-ui/text-editor.js' },
		],
	},
	build: {
		outDir: `../insights/public/frontend`,
		emptyOutDir: true,
		target: 'es2020',
		sourcemap: false,
		minify: 'esbuild',
		cssMinify: 'esbuild',
		rollupOptions: {
			treeshake: {
				moduleSideEffects: 'no-external',
				propertyReadSideEffects: false,
				tryCatchDeoptimization: false,
			},
			external: ['echarts'],
			output: {
				globals: {
					echarts: 'echarts',
				},
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
				},
			},
		},
	},
	optimizeDeps: {
		include: ['showdown', 'highlight.js/lib/core'],
		exclude: [
			'feather-icons', 'lucide-vue-next', 'echarts', 'frappe-ui', 'reka-ui',
			'codemirror', '@codemirror/lang-javascript',
			'@codemirror/lang-python', '@codemirror/lang-sql', 'vue-codemirror', 'thememirror',
			"@tiptap/vue-3", "@tiptap/suggestion",
		],
	},
	define: {
		// enable hydration mismatch details in production build
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
	},
}))
