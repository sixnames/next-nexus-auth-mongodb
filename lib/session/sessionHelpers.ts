import { getSession } from 'next-auth/client';
import { UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/locales';
import { NexusContext } from 'types/context';
import { COL_USERS } from 'db/collectionNames';

export const getSessionUser = async (context: any): Promise<UserModel | null> => {
  // Get session user
  const session = await getSession(context);
  if (!session?.user) {
    return null;
  }

  // Get session user from db
  const db = await getDatabase();
  const collection = db.collection(COL_USERS);

  return collection.findOne<UserModel>(
    { email: session.user.email },
    { projection: { password: 0 } },
  );
};

export const getSessionLocale = (context: NexusContext): string => {
  // Get locale form context if request form server
  // Otherwise get locale from Content-Language header
  // populated with Apollo client
  return context.locale || context.req.headers['content-language'] || DEFAULT_LOCALE;
};

export const getSessionCity = (context: NexusContext): string => {
  let city = DEFAULT_CITY;

  const firstIndex = 0;
  const secondIndex = 1;

  // Get host from request Host header
  const host = context.req.headers.host;
  // Remove port if exist
  const noPortHost = host?.split(':')[firstIndex];
  // Get site domain from host parts
  const hostParts = noPortHost?.split('.');
  const domainIndex = hostParts?.findIndex((part) => part === process.env.HOST);

  // Return default city if no subdomain
  if (!domainIndex) {
    return city;
  }

  if (domainIndex < secondIndex) {
    return city;
  }

  // Return subdomain as city
  if (hostParts && hostParts[firstIndex]) {
    city = hostParts[firstIndex];
  }

  return city;
};

export interface GetRequestParamsPayloadInterface {
  locale: string;
  city: string;
}

// City, locale and api messages helper
export const getRequestParams = async (
  context: NexusContext,
): Promise<GetRequestParamsPayloadInterface> => {
  const locale = getSessionLocale(context);
  const city = getSessionCity(context);

  return {
    locale,
    city,
  };
};
