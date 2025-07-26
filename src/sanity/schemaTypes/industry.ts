import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'industry',
  title: 'Industry Experience',
  type: 'document',
  fields: [
    defineField({ name: 'company', title: 'Company', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'startYear', title: 'Start Year', type: 'number' }),
    defineField({ name: 'endYear', title: 'End Year', type: 'number' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
  ],
}) 