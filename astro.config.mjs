import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://yuanlin2004.github.io', base: '/spark-atlas',
  integrations: [starlight({
    title: 'SparkAtlas', description: 'Evidence-first field notes for NVIDIA DGX Spark.',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/yuanlin2004/spark-atlas' }],
    customCss: ['./src/styles/custom.css'],
    components: { PageTitle: './src/components/PageTitle.astro' },
    sidebar: [{label:'Start here',items:[{label:'Welcome',slug:''}]},
      {label:'Field notes',items:[{autogenerate:{directory:'guides'}}]},
      {label:'How we publish',items:[{autogenerate:{directory:'about'}}]}],
  })],
});
