import { jwtVerify } from 'jose';

type EdgeAccessPayload = {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  type: 'access';
};

export async function verifyAccessTokenEdge(token: string): Promise<EdgeAccessPayload> {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is required');
  }

  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  if (payload.type !== 'access' || !payload.sub || !payload.role || !payload.email) {
    throw new Error('Invalid access token payload');
  }

  return payload as EdgeAccessPayload;
}
