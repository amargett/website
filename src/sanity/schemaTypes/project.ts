import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string', 
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'category', 
      title: 'Category', 
      type: 'string',
      options: {
        list: [
          {title: 'Research', value: 'research'},
          {title: 'Industry', value: 'industry'},
          {title: 'Coursework', value: 'coursework'},
          {title: 'Extracurricular', value: 'extracurricular'},
        ],
      },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'technicalSkills', 
      title: 'Technical Skills', 
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Mechanical Design', value: 'mechanical-design'},
          {title: 'Electronics', value: 'electronics'},
          {title: 'Python', value: 'python'},
          {title: 'C++', value: 'cpp'},
        ],
      },
      description: 'Select all technical skills used in this project'
    }),
    defineField({ 
      name: 'featured', 
      title: 'Featured Project', 
      type: 'boolean', 
      initialValue: false,
      description: 'Check this to include in Featured Projects section'
    }),
    defineField({ 
      name: 'featuredOrder', 
      title: 'Featured Order', 
      type: 'number',
      description: 'Order in Featured Projects section (lower numbers appear first)',
      hidden: ({document}) => !document?.featured
    }),
    defineField({ 
      name: 'featuredLayout', 
      title: 'Featured Layout', 
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Wide (2 columns)', value: 'wide'},
          {title: 'Tall (2 rows)', value: 'tall'},
        ],
      },
      description: 'How this project should appear in the Featured Projects grid',
      initialValue: 'standard',
      hidden: ({document}) => !document?.featured
    }),
    defineField({ 
      name: 'shortDescription', 
      title: 'Short Description', 
      type: 'text',
      description: 'Brief description for category pages (max 200 characters)',
      validation: Rule => Rule.max(200).required()
    }),
    defineField({ 
      name: 'fullDescription', 
      title: 'Full Description', 
      type: 'array',
      of: [{type: 'block'}],
      description: 'Detailed description for the project page'
    }),
    defineField({ 
      name: 'mainMedia', 
      title: 'Main Media', 
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              {title: 'Image', value: 'image'},
              {title: 'Video/GIF', value: 'video'},
            ],
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { 
            hotspot: true,
            crop: true,
            accept: 'image/*'
          },
          hidden: ({parent}) => parent?.type !== 'image'
        },
        {
          name: 'videoFile',
          title: 'Video/GIF File',
          type: 'file',
          options: {
            accept: 'video/*,.gif'
          },
          hidden: ({parent}) => parent?.type !== 'video'
        },
        {
          name: 'videoUrl',
          title: 'Video/GIF URL (Alternative)',
          type: 'url',
          description: 'Use this if you prefer to host the video externally',
          hidden: ({parent}) => parent?.type !== 'video'
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'gallery', 
      title: 'Project Gallery', 
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true }
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            }
          ]
        }
      ]
    }),
    defineField({ 
      name: 'year', 
      title: 'Year', 
      type: 'number' 
    }),
    defineField({ 
      name: 'institution', 
      title: 'Institution/Company', 
      type: 'string' 
    }),
    defineField({ 
      name: 'publication', 
      title: 'Publication', 
      type: 'string',
      hidden: ({document}) => document?.category !== 'research'
    }),
    defineField({ 
      name: 'courseCode', 
      title: 'Course Code', 
      type: 'string',
      hidden: ({document}) => document?.category !== 'coursework'
    }),
    defineField({ 
      name: 'role', 
      title: 'Role', 
      type: 'string',
      hidden: ({document}) => document?.category !== 'industry'
    }),
    defineField({ 
      name: 'organization', 
      title: 'Organization', 
      type: 'string',
      hidden: ({document}) => document?.category !== 'extracurricular'
    }),
    defineField({ 
      name: 'links', 
      title: 'Links', 
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              options: {
                list: [
                  {title: 'GitHub', value: 'github'},
                  {title: 'Demo', value: 'demo'},
                  {title: 'Paper', value: 'paper'},
                  {title: 'Website', value: 'website'},
                  {title: 'Other', value: 'other'},
                ],
              }
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url'
            }
          ]
        }
      ]
    }),
    defineField({ 
      name: 'technologies', 
      title: 'Technologies Used', 
      type: 'array',
      of: [{type: 'string'}]
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      featured: 'featured',
      media: 'mainMedia.image'
    },
    prepare(selection) {
      const {title, category, featured, media} = selection
      return {
        title: title,
        subtitle: `${category}${featured ? ' (Featured)' : ''}`,
        media: media
      }
    }
  }
}) 