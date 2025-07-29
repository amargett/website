import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string',
      initialValue: 'About Me',
      validation: Rule => Rule.required() 
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { 
        hotspot: true,
        crop: true,
        accept: 'image/*'
      },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'introduction', 
      title: 'Introduction', 
      type: 'text',
      description: 'A brief introduction about yourself (max 500 characters)',
      validation: Rule => Rule.max(500).required()
    }),
    defineField({ 
      name: 'email', 
      title: 'Email Address', 
      type: 'string',
      validation: Rule => Rule.email().required()
    }),
    defineField({ 
      name: 'linkedin', 
      title: 'LinkedIn URL', 
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'resume', 
      title: 'Resume File', 
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx'
      },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'github', 
      title: 'GitHub URL', 
      type: 'url',
      description: 'Optional GitHub profile link'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'photo'
    },
    prepare(selection) {
      const {title, media} = selection
      return {
        title: title,
        subtitle: 'About page content',
        media: media
      }
    }
  }
}) 