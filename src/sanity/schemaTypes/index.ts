import { type SchemaTypeDefinition } from 'sanity'
import featuredProject from './featuredProject'
import research from './research'
import industry from './industry'
import coursework from './coursework'
import activity from './activities'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [featuredProject, research, industry, coursework, activity],
}
