import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import featuredProject from './featuredProject'
import research from './research'
import industry from './industry'
import coursework from './coursework'
import activity from './activities'
import about from './about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, featuredProject, research, industry, coursework, activity, about],
}
