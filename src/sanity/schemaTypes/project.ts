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
      name: 'content', 
      title: 'Project Content', 
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'object',
          name: 'projectImage',
          title: 'Project Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { 
                hotspot: true,
                crop: true,
                accept: 'image/*'
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'size',
              title: 'Image Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Small', value: 'small'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Large', value: 'large'},
                  {title: 'Full Width', value: 'full'},
                ],
              },
              initialValue: 'medium'
            },
            {
              name: 'objectFit',
              title: 'Image Fit',
              type: 'string',
              options: {
                list: [
                  {title: 'Cover (crop to fill)', value: 'cover'},
                  {title: 'Contain (show full image)', value: 'contain'},
                  {title: 'Fill (stretch)', value: 'fill'},
                ],
              },
              description: 'How the image should be displayed',
              initialValue: 'cover'
            },
            {
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              options: {
                list: [
                  {title: 'Auto (natural)', value: 'auto'},
                  {title: 'Square (1:1)', value: 'square'},
                  {title: 'Landscape (16:9)', value: 'landscape'},
                  {title: 'Portrait (3:4)', value: 'portrait'},
                  {title: 'Wide (21:9)', value: 'wide'},
                ],
              },
              description: 'Force a specific aspect ratio',
              initialValue: 'auto'
            }
          ],
          preview: {
            select: {
              media: 'image',
              title: 'alt',
              subtitle: 'caption'
            }
          }
        },
        {
          type: 'object',
          name: 'projectVideo',
          title: 'Project Video',
          fields: [
            {
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*,.gif'
              }
            },
            {
              name: 'videoUrl',
              title: 'Video URL (Alternative)',
              type: 'url',
              description: 'Use this if you prefer to host the video externally'
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'size',
              title: 'Video Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Small', value: 'small'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Large', value: 'large'},
                  {title: 'Full Width', value: 'full'},
                ],
              },
              initialValue: 'medium'
            },
            {
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              options: {
                list: [
                  {title: 'Auto (natural)', value: 'auto'},
                  {title: 'Square (1:1)', value: 'square'},
                  {title: 'Landscape (16:9)', value: 'landscape'},
                  {title: 'Portrait (3:4)', value: 'portrait'},
                  {title: 'Wide (21:9)', value: 'wide'},
                ],
              },
              description: 'Force a specific aspect ratio',
              initialValue: 'auto'
            }
          ],
          preview: {
            select: {
              media: 'videoFile',
              title: 'alt',
              subtitle: 'caption'
            }
          }
        }
      ],
      description: 'Write your project content here. You can add text, images, and videos inline as you go.'
    }),
    defineField({ 
      name: 'showMainMedia', 
      title: 'Show Main Media on Project Page', 
      type: 'boolean',
      description: 'Toggle to show/hide the main media at the top of the project page',
      initialValue: true
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
      name: 'year', 
      title: 'Year', 
      type: 'number' 
    }),
    defineField({ 
      name: 'publication', 
      title: 'Publication', 
      type: 'string',
      hidden: ({document}) => document?.category !== 'research'
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