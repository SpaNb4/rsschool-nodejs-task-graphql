import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { postFields } from '../../posts/schemas.js';
import { UUIDType } from '../types/uuid.js';

const post = Type.Object(postFields);

export type Post = Static<typeof post>;

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});
