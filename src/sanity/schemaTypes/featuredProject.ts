import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', validation: Rule => Rule.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'githubUrl', title: 'GitHub URL', type: 'url' }),
    defineField({ name: 'demoUrl', title: 'Demo URL', type: 'url' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({ name: 'highlight', title: 'Highlight', type: 'boolean', initialValue: false }),
  ],
}) 