export interface GuildRes {
  features: any[];
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
}

export interface UserDataRes {
  accent_color: null;
  avatar: string;
  avatar_decoration: null;
  banner: null;
  banner_color: null;
  discriminator: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
  verified: boolean;
}
