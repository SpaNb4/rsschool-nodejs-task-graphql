import { Profile } from '@prisma/client';
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdEnum, MemberTypeType } from './memberType.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberType: {
      type: MemberTypeType,
      resolve: async (parent: Profile, _args, { dataLoaders }: Context) => {
        return dataLoaders.membersLoader.load(parent.memberTypeId);
      },
    },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});
