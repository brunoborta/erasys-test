import type { Profile } from '@borta/user-pictures';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {profile.name}
      </h1>
      {profile.headline && (
        <p className="mt-4 text-lg text-foreground-secondary">
          {profile.headline}
        </p>
      )}
      <p className="mt-2 text-sm text-muted">
        Profile ID: {profile.id}
      </p>
    </div>
  );
}
