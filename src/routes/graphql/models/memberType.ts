import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { MemberTypeId, memberTypeFields } from '../../member-types/schemas.js';

const memberType = Type.Object(memberTypeFields);

export type MemberType = Static<typeof memberType>;

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});
