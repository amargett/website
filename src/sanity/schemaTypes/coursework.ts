import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'coursework',
  title: 'Coursework',
  type: 'document',
  fields: [
    defineField({ name: 'courseCode', title: 'Course Code', type: 'string' }),
    defineField({ name: 'courseName', title: 'Course Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({ name: 'institution', title: 'Institution', type: 'string' }),
  ],
}) 